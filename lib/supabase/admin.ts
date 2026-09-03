import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Full-access client used ONLY inside Server Actions under app/admin.
 * The `server-only` import guarantees this file can never be pulled into a
 * client bundle by mistake — if it is, the build fails instead of leaking
 * the service-role key.
 *
 * The service-role key bypasses Row Level Security entirely, which is what
 * lets the admin panel write to every table even though there are no
 * anon/authenticated write policies (see supabase/schema.sql).
 *
 * IMPORTANT: the admin panel itself has no login yet (per the current
 * build). Anyone who can reach /admin can call these actions. Do not deploy
 * this app publicly until you add authentication — see the README section
 * "Adding admin authentication later".
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Copy .env.local.example to .env.local and fill them in (the service role key is in Supabase → Project Settings → API)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
