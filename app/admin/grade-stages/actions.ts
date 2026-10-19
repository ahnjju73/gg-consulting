"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function parseItems(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createGradeStage(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("grade_stages").insert({
    slug: formData.get("slug"),
    grade_tag: formData.get("grade_tag"),
    title: formData.get("title"),
    description: formData.get("description"),
    items: parseItems(formData.get("items")),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/curriculum");
  revalidatePath("/admin/grade-stages");
}

export async function updateGradeStage(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("grade_stages")
    .update({
      grade_tag: formData.get("grade_tag"),
      title: formData.get("title"),
      description: formData.get("description"),
      items: parseItems(formData.get("items")),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/curriculum");
  revalidatePath("/admin/grade-stages");
}

export async function deleteGradeStage(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("grade_stages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/curriculum");
  revalidatePath("/admin/grade-stages");
}
