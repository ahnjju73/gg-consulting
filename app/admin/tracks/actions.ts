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

export async function createTrack(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("tracks").insert({
    slug: formData.get("slug"),
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    lead: formData.get("lead"),
    color: formData.get("color"),
    items: parseItems(formData.get("items")),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/tracks");
}

export async function updateTrack(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("tracks")
    .update({
      eyebrow: formData.get("eyebrow"),
      title: formData.get("title"),
      lead: formData.get("lead"),
      color: formData.get("color"),
      items: parseItems(formData.get("items")),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/tracks");
}

export async function deleteTrack(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/tracks");
}
