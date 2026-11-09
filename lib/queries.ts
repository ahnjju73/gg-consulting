import { createPublicClient } from "./supabase/public";
import type {
  SiteSettings,
  Stat,
  StatGroup,
  Pillar,
  Track,
  FacultyMember,
  Testimonial,
  Popup,
  CampusPhoto,
  CampusPhotoPosition,
  GradeStage,
  WinterCampCategory,
  WinterCampCourse,
} from "./types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function getStats(group: StatGroup): Promise<Stat[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("group_name", group)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Stat[];
}

export async function getPillars(): Promise<Pillar[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Pillar[];
}

export async function getTracks(): Promise<Track[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Track[];
}

export async function getFaculty(): Promise<FacultyMember[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FacultyMember[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function getActivePopups(): Promise<Popup[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("popups")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Popup[];
}

// All three fixed campus_photos rows (see supabase/schema.sql), keyed by
// position for easy lookup on the home page. Returns every row regardless
// of `active`/`image_url` — the page decides what to render, the admin
// panel needs every row to build its edit forms.
export async function getCampusPhotos(): Promise<
  Record<CampusPhotoPosition, CampusPhoto | undefined>
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("campus_photos").select("*");
  if (error) throw error;
  const rows = (data ?? []) as CampusPhoto[];
  return Object.fromEntries(rows.map((r) => [r.position, r])) as Record<
    CampusPhotoPosition,
    CampusPhoto | undefined
  >;
}

export async function getGradeStages(): Promise<GradeStage[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("grade_stages")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GradeStage[];
}

export async function getWinterCampCategories(): Promise<WinterCampCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("winter_camp_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WinterCampCategory[];
}

export async function getWinterCampCourses(): Promise<WinterCampCourse[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("winter_camp_courses")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WinterCampCourse[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Looks up a single course by id for /winter-camp/[id]. Returns null (not a
// thrown error) both when the id is well-formed but no row matches, and when
// it's not a valid uuid at all — a malformed id in the URL should 404, not
// 500, and Postgres throws on `.eq("id", <non-uuid text>)` rather than just
// returning zero rows, so the format is checked before ever querying.
export async function getWinterCampCourse(
  id: string
): Promise<WinterCampCourse | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("winter_camp_courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as WinterCampCourse) ?? null;
}
