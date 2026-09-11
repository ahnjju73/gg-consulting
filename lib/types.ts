export type SiteSettings = {
  id: number;
  academy_name: string;
  logo_text_main: string;
  logo_text_accent: string;
  since_year: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_description: string;
  philosophy_quote: string;
  philosophy_author: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  business_hours: string | null;
  business_reg_no: string | null;
  academy_license_no: string | null;
  representative_name: string | null;
  logo_url: string | null;
  show_results_stats: boolean;
  show_testimonials: boolean;
  updated_at: string;
};

export type StatGroup = "hero" | "results";

export type Stat = {
  id: string;
  group_name: StatGroup;
  label: string;
  value: string;
  sort_order: number;
};

export type Pillar = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
};

export type TrackColor = "gold" | "bay";

export type Track = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  color: TrackColor;
  items: string[];
  sort_order: number;
};

export type FacultyMember = {
  id: string;
  name: string;
  roles: string[];
  university: string | null;
  bio: string | null;
  avatar_url: string | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  sort_order: number;
};

export type Popup = {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

// Three fixed slots (see supabase/schema.sql) — big full-bleed photo bands
// shown between sections on the home page. `position` is the primary key
// and only ever one of these three values; there is no free-form list.
export type CampusPhotoPosition = "after_hero" | "after_programs" | "after_faculty";

export type CampusPhoto = {
  position: CampusPhotoPosition;
  university: string;
  location: string | null;
  caption: string | null;
  image_url: string | null;
  active: boolean;
  updated_at: string;
};
