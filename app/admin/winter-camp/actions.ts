"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMediaFile } from "@/lib/supabase/storage";

async function uploadImage(
  supabase: ReturnType<typeof createAdminClient>,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `winter-camp-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export async function createWinterCampCourse(formData: FormData) {
  const supabase = createAdminClient();

  const payload: Record<string, unknown> = {
    course_name: formData.get("course_name"),
    teacher_name: formData.get("teacher_name"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  // Image is optional at creation time — admins often add the course name
  // and teacher first, then upload the "수업소개" photo once it's ready.
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    payload.image_url = await uploadImage(supabase, image);
  }

  const { error } = await supabase.from("winter_camp_courses").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/winter-camp");
  revalidatePath("/admin/winter-camp");
}

export async function updateWinterCampCourse(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const previousImageUrl = formData.get("current_image_url") as string | null;

  const payload: Record<string, unknown> = {
    course_name: formData.get("course_name"),
    teacher_name: formData.get("teacher_name"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const image = formData.get("image");
  const replacingImage = image instanceof File && image.size > 0;
  if (replacingImage) {
    payload.image_url = await uploadImage(supabase, image as File);
  }

  const { error } = await supabase
    .from("winter_camp_courses")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);

  // Only after the row is safely updated do we remove the old image, so a
  // failed update never leaves a record pointing at a deleted file.
  if (replacingImage) {
    await deleteMediaFile(supabase, previousImageUrl);
  }

  revalidatePath("/winter-camp");
  revalidatePath(`/winter-camp/${id}`);
  revalidatePath("/admin/winter-camp");
}

export async function deleteWinterCampCourse(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("current_image_url") as string | null;

  const { error } = await supabase
    .from("winter_camp_courses")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  await deleteMediaFile(supabase, imageUrl);

  revalidatePath("/winter-camp");
  revalidatePath("/admin/winter-camp");
}
