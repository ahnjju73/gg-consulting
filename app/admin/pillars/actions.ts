"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createPillar(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("pillars").insert({
    title: formData.get("title"),
    description: formData.get("description"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/pillars");
}

export async function updatePillar(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("pillars")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/pillars");
}

export async function deletePillar(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/pillars");
}
