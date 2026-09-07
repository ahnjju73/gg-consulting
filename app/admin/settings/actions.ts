"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMediaFile } from "@/lib/supabase/storage";

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function updateSettings(formData: FormData) {
  const supabase = createAdminClient();

  const payload: Record<string, unknown> = {
    academy_name: str(formData, "academy_name"),
    logo_text_main: str(formData, "logo_text_main"),
    logo_text_accent: str(formData, "logo_text_accent"),
    since_year: str(formData, "since_year"),
    hero_title_line1: str(formData, "hero_title_line1"),
    hero_title_line2: str(formData, "hero_title_line2"),
    hero_description: str(formData, "hero_description"),
    philosophy_quote: str(formData, "philosophy_quote"),
    philosophy_author: str(formData, "philosophy_author"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    address: str(formData, "address"),
    business_hours: str(formData, "business_hours"),
    business_reg_no: str(formData, "business_reg_no"),
    academy_license_no: str(formData, "academy_license_no"),
    representative_name: str(formData, "representative_name"),
    updated_at: new Date().toISOString(),
  };

  const previousLogoUrl = formData.get("current_logo_url") as string | null;
  const logoFile = formData.get("logo");
  const replacingLogo = logoFile instanceof File && logoFile.size > 0;
  if (replacingLogo) {
    const ext = logoFile.name.split(".").pop() || "png";
    const path = `logo-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, logoFile, { upsert: true, contentType: logoFile.type });
    if (uploadError) {
      throw new Error(`로고 업로드 실패: ${uploadError.message}`);
    }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    payload.logo_url = pub.publicUrl;
  }

  const { error } = await supabase
    .from("site_settings")
    .update(payload)
    .eq("id", 1);
  if (error) throw new Error(error.message);

  // Only after the row is safely updated do we remove the old logo, so a
  // failed update never leaves the site pointing at a deleted file.
  if (replacingLogo) {
    await deleteMediaFile(supabase, previousLogoUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
