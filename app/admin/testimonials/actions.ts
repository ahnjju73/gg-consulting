"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createTestimonial(formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").insert({
    quote: formData.get("quote"),
    author: formData.get("author"),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("testimonials")
    .update({
      quote: formData.get("quote"),
      author: formData.get("author"),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
