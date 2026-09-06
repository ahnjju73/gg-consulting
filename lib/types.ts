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
