import "server-only";
import type { createAdminClient } from "./admin";

const MEDIA_BUCKET = "media";

/**
 * Deletes an object from the `media` bucket given its public URL (the same
 * string `getPublicUrl()` returns and that gets stored as avatar_url /
 * image_url / logo_url). Used whenever a record's image is replaced or the
 * record itself is deleted, so old uploads don't pile up in Storage forever.
 *
 * Safe to call with null/undefined (nothing to delete) or with a URL that
 * doesn't point into this bucket (left untouched). Never throws — a failed
 * cleanup is logged but must not block or roll back the DB write that
 * triggered it; a stray file in Storage is a much smaller problem than a
 * user-facing 500 on save/delete.
 */
export async function deleteMediaFile(
  supabase: ReturnType<typeof createAdminClient>,
  url: string | null | undefined
) {
  if (!url) return;

  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not one of our uploads (e.g. an external URL)

  const path = decodeURIComponent(url.slice(idx + marker.length));
  if (!path) return;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    console.error(`[media cleanup] failed to delete "${path}":`, error.message);
  }
}
