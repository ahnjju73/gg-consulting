"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMediaFile } from "@/lib/supabase/storage";

function optionalText(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function uploadImage(
  supabase: ReturnType<typeof createAdminClient>,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `popup-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export async function createPopup(formData: FormData) {
  const supabase = createAdminClient();

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    throw new Error("팝업 이미지를 선택해주세요.");
  }

  const payload: Record<string, unknown> = {
    title: optionalText(formData.get("title")),
    link_url: optionalText(formData.get("link_url")),
    active: formData.get("active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    image_url: await uploadImage(supabase, image),
  };

  const { error } = await supabase.from("popups").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/popups");
}

export async function updatePopup(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const previousImageUrl = formData.get("current_image_url") as string | null;

  const payload: Record<string, unknown> = {
    title: optionalText(formData.get("title")),
    link_url: optionalText(formData.get("link_url")),
    active: formData.get("active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const image = formData.get("image");
  const replacingImage = image instanceof File && image.size > 0;
  if (replacingImage) {
    payload.image_url = await uploadImage(supabase, image as File);
  }

  const { error } = await supabase.from("popups").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  // Only after the row is safely updated do we remove the old image, so a
  // failed update never leaves a record pointing at a deleted file.
  if (replacingImage) {
    await deleteMediaFile(supabase, previousImageUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/popups");
}

export async function deletePopup(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("current_image_url") as string | null;

  const { error } = await supabase.from("popups").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await deleteMediaFile(supabase, imageUrl);

  revalidatePath("/");
  revalidatePath("/admin/popups");
}
