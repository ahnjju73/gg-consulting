"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMediaFile } from "@/lib/supabase/storage";

function parseRoles(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function optionalText(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function uploadAvatar(
  supabase: ReturnType<typeof createAdminClient>,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `faculty-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(`사진 업로드 실패: ${error.message}`);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export async function createFaculty(formData: FormData) {
  const supabase = createAdminClient();

  const payload: Record<string, unknown> = {
    name: formData.get("name"),
    roles: parseRoles(formData.get("roles")),
    university: optionalText(formData.get("university")),
    bio: formData.get("bio"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    payload.avatar_url = await uploadAvatar(supabase, avatar);
  }

  const { error } = await supabase.from("faculty").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/faculty");
}

export async function updateFaculty(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const previousAvatarUrl = formData.get("current_avatar_url") as string | null;

  const payload: Record<string, unknown> = {
    name: formData.get("name"),
    roles: parseRoles(formData.get("roles")),
    university: optionalText(formData.get("university")),
    bio: formData.get("bio"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const avatar = formData.get("avatar");
  const replacingAvatar = avatar instanceof File && avatar.size > 0;
  if (replacingAvatar) {
    payload.avatar_url = await uploadAvatar(supabase, avatar as File);
  }

  const { error } = await supabase.from("faculty").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  // Only after the row is safely updated do we remove the old photo, so a
  // failed update never leaves a record pointing at a deleted file.
  if (replacingAvatar) {
    await deleteMediaFile(supabase, previousAvatarUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/faculty");
}

export async function deleteFaculty(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const avatarUrl = formData.get("current_avatar_url") as string | null;

  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await deleteMediaFile(supabase, avatarUrl);

  revalidatePath("/");
  revalidatePath("/admin/faculty");
}
