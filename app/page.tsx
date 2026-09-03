import type { Metadata } from "next";
import Nav from "./components/site/Nav";
import Hero from "./components/site/Hero";
import Mission from "./components/site/Mission";
import Pillars from "./components/site/Pillars";
import Tracks from "./components/site/Tracks";
import Faculty from "./components/site/Faculty";
import StatsBand from "./components/site/StatsBand";
import Testimonials from "./components/site/Testimonials";
import Contact from "./components/site/Contact";
import Footer from "./components/site/Footer";
import {
  getSiteSettings,
  getStats,
  getPillars,
  getTracks,
  getFaculty,
  getTestimonials,
} from "@/lib/queries";

// Content lives in Supabase and is edited from /admin, so this page must
// never be served from a stale build-time cache.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.academy_name,
    description: settings.hero_description,
  };
}

export default async function HomePage() {
  const [settings, heroStats, resultStats, pillars, tracks, faculty, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getStats("hero"),
      getStats("results"),
      getPillars(),
      getTracks(),
      getFaculty(),
      getTestimonials(),
    ]);

  return (
    <>
      <Nav
        logoMain={settings.logo_text_main}
        logoAccent={settings.logo_text_accent}
        logoUrl={settings.logo_url}
      />
      <Hero settings={settings} stats={heroStats} />
      <Mission settings={settings} />
      <Pillars pillars={pillars} />
      <Tracks tracks={tracks} />
      <Faculty faculty={faculty} />
      <StatsBand stats={resultStats} />
      <Testimonials testimonials={testimonials} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
