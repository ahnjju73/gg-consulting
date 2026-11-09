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

// category_id/sessions_count/total_hours are all optional — an empty select
// or empty number input should land as null, not "" or NaN.
function optionalId(value: FormDataEntryValue | null): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > 0 ? s : null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const s = typeof value === "string" ? value.trim() : "";
  if (s.length === 0) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function createWinterCampCourse(formData: FormData) {
  const supabase = createAdminClient();

  const payload: Record<string, unknown> = {
    category_id: optionalId(formData.get("category_id")),
    course_name: formData.get("course_name"),
    teacher_name: formData.get("teacher_name"),
    sessions_count: optionalInt(formData.get("sessions_count")),
    total_hours: optionalInt(formData.get("total_hours")),
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
    category_id: optionalId(formData.get("category_id")),
    course_name: formData.get("course_name"),
    teacher_name: formData.get("teacher_name"),
    sessions_count: optionalInt(formData.get("sessions_count")),
    total_hours: optionalInt(formData.get("total_hours")),
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

// ---------------------------------------------------------------------------
// 카테고리 (영어/수학/컴퓨터/바이오 같은 분류) — 삭제해도 소속 수업이 지워지지
// 않도록 DB에서 category_id를 on delete set null로 두었으므로, 여기서는 그냥
// 지우기만 하면 됩니다 (소속 수업은 "기타"로 자동 이동).
// ---------------------------------------------------------------------------

export async function createWinterCampCategory(formData: FormData) {
  const supabase = createAdminClient();

  const payload = {
    name: formData.get("name"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const { error } = await supabase
    .from("winter_camp_categories")
    .insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/winter-camp");
  revalidatePath("/admin/winter-camp");
}

export async function updateWinterCampCategory(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;

  const payload = {
    name: formData.get("name"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const { error } = await supabase
    .from("winter_camp_categories")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/winter-camp");
  revalidatePath("/admin/winter-camp");
}

export async function deleteWinterCampCategory(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("winter_camp_categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/winter-camp");
  revalidatePath("/admin/winter-camp");
}
