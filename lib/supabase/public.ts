import { createClient } from "@supabase/supabase-js";

/**
 * Read-only client for the public site. Uses the anon key, which is safe to
 * expose in the browser bundle — every table's RLS policy only allows
 * SELECT for this key (see supabase/schema.sql). Writes always go through
 * the admin Server Actions instead (lib/supabase/admin.ts).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. Copy .env.local.example to .env.local and fill them in."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
