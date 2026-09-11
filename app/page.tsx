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
import Popups from "./components/site/Popups";
import CampusFeature from "./components/site/CampusFeature";
import {
  getSiteSettings,
  getStats,
  getPillars,
  getTracks,
  getFaculty,
  getTestimonials,
  getActivePopups,
  getCampusPhotos,
} from "@/lib/queries";

// Content lives in Supabase and is edited from /admin, so this page must
// never be served from a stale build-time cache.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  // KakaoTalk/social share previews want an explicit og:image — without one,
  // some crawlers fall back to scanning the page for the first sizeable
  // <img> (a faculty photo), which is not the brand. Prefer the uploaded
  // logo; fall back to a bundled brand card so there's always something
  // correct even before a logo is uploaded.
  const ogImage = settings.logo_url || "/og-default.png";

  return {
    title: settings.academy_name,
    description: settings.hero_description,
    openGraph: {
      title: settings.academy_name,
      description: settings.hero_description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.academy_name,
      description: settings.hero_description,
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const [settings, heroStats, resultStats, pillars, tracks, faculty, testimonials, popups, campusPhotos] =
    await Promise.all([
      getSiteSettings(),
      getStats("hero"),
      getStats("results"),
      getPillars(),
      getTracks(),
      getFaculty(),
      getTestimonials(),
      getActivePopups(),
      getCampusPhotos(),
    ]);

  return (
    <>
      <Popups popups={popups} />
      <Nav
        logoMain={settings.logo_text_main}
        logoAccent={settings.logo_text_accent}
        logoUrl={settings.logo_url}
        showResults={settings.show_results_stats}
      />
      <Hero settings={settings} stats={heroStats} />
      <CampusFeature photo={campusPhotos.after_hero} />
      <Mission settings={settings} />
      <Pillars pillars={pillars} />
      <Tracks tracks={tracks} />
      <CampusFeature photo={campusPhotos.after_programs} />
      <Faculty faculty={faculty} />
      <CampusFeature photo={campusPhotos.after_faculty} />
      {settings.show_results_stats && <StatsBand stats={resultStats} />}
      {settings.show_testimonials && <Testimonials testimonials={testimonials} />}
      <Contact settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
