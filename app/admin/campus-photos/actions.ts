"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMediaFile } from "@/lib/supabase/storage";
import type { CampusPhotoPosition } from "@/lib/types";

const VALID_POSITIONS: CampusPhotoPosition[] = [
  "after_hero",
  "after_programs",
  "after_faculty",
];

function optionalText(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function uploadImage(
  supabase: ReturnType<typeof createAdminClient>,
  position: string,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `campus-${position}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// There is no create/delete here on purpose — the three rows are fixed
// slots seeded once by schema.sql (see supabase/schema.sql and
// lib/types.ts's CampusPhotoPosition). This action only ever updates an
// existing row in place: swap the photo, edit the caption, or flip
// "visible" off — it never adds or removes a slot.
export async function updateCampusPhoto(formData: FormData) {
  const position = formData.get("position") as string;
  if (!VALID_POSITIONS.includes(position as CampusPhotoPosition)) {
    throw new Error("알 수 없는 위치입니다.");
  }

  const supabase = createAdminClient();
  const previousImageUrl = formData.get("current_image_url") as string | null;

  const payload: Record<string, unknown> = {
    university: optionalText(formData.get("university")) ?? "",
    location: optionalText(formData.get("location")),
    caption: optionalText(formData.get("caption")),
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  };

  const image = formData.get("image");
  const replacingImage = image instanceof File && image.size > 0;
  if (replacingImage) {
    payload.image_url = await uploadImage(supabase, position, image as File);
  }

  const { error } = await supabase
    .from("campus_photos")
    .update(payload)
    .eq("position", position);
  if (error) throw new Error(error.message);

  // Only after the row is safely updated do we remove the old image, so a
  // failed update never leaves a record pointing at a deleted file.
  if (replacingImage) {
    await deleteMediaFile(supabase, previousImageUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/campus-photos");
}
