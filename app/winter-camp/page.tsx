import type { Metadata } from "next";
import Nav from "../components/site/Nav";
import PageHeader from "../components/site/PageHeader";
import WinterCampGrid from "../components/site/WinterCampGrid";
import Footer from "../components/site/Footer";
import Popups from "../components/site/Popups";
import {
  getSiteSettings,
  getWinterCampCategories,
  getWinterCampCourses,
  getActivePopups,
} from "@/lib/queries";

// Settings + the course roster are both admin-editable from /admin — never
// serve this from a stale build-time cache (see app/page.tsx for the same
// reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.winter_camp_title} | ${settings.academy_name}`,
    description: `${settings.winter_camp_title} 개설 수업을 안내합니다.`,
  };
}

export default async function WinterCampPage() {
  const [settings, categories, courses, popups] = await Promise.all([
    getSiteSettings(),
    getWinterCampCategories(),
    getWinterCampCourses(),
    getActivePopups(),
  ]);

  return (
    <>
      <Popups popups={popups} />
      <Nav
        logoMain={settings.logo_text_main}
        logoAccent={settings.logo_text_accent}
        logoUrl={settings.logo_url}
        showResults={settings.show_results_stats}
        winterCampTitle={settings.winter_camp_title}
        winterCampVisible={settings.winter_camp_nav_visible}
      />
      <PageHeader
        eyebrow="WINTER CAMP"
        title={settings.winter_camp_title}
        lead="개설된 수업과 담당 선생님을 확인하세요. 수업소개를 누르면 자세한 안내를 볼 수 있습니다."
      />
      <WinterCampGrid categories={categories} courses={courses} />
      <Footer settings={settings} />
    </>
  );
}
