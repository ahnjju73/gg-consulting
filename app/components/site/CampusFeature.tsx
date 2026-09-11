import type { CampusPhoto } from "@/lib/types";

// One of the three fixed campus_photos slots (see supabase/schema.sql),
// rendered as a big full-bleed photo band between two sections. Self-guards
// like Testimonials.tsx does — no visible photo, no section, so a missing
// upload or `active = false` never leaves a gap or placeholder art behind.
export default function CampusFeature({ photo }: { photo?: CampusPhoto }) {
  if (!photo || !photo.active || !photo.image_url) return null;

  return (
    <section className="campus-feature">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.image_url}
        alt={photo.university}
        className="campus-feature-img"
      />
      <div className="campus-feature-cap">
        <div className="wrap">
          <b>{photo.university}</b>
          {photo.location && <span className="place">{photo.location}</span>}
          {photo.caption && <p>{photo.caption}</p>}
        </div>
      </div>
    </section>
  );
}
