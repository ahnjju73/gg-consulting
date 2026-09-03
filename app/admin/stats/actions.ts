"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createStat(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("stats").insert({
    group_name: formData.get("group_name"),
    label: formData.get("label"),
    value: formData.get("value"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function updateStat(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("stats")
    .update({
      label: formData.get("label"),
      value: formData.get("value"),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function deleteStat(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("stats").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/stats");
}
