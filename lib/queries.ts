import { createPublicClient } from "./supabase/public";
import type {
  SiteSettings,
  Stat,
  StatGroup,
  Pillar,
  Track,
  FacultyMember,
  Testimonial,
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
