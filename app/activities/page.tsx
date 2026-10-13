import type { Metadata } from "next";
import Nav from "../components/site/Nav";
import PageHeader from "../components/site/PageHeader";
import EcServices from "../components/site/EcServices";
import Footer from "../components/site/Footer";
import Popups from "../components/site/Popups";
import { getSiteSettings, getActivePopups } from "@/lib/queries";

// settings/popups are admin-editable from /admin — never serve this from a
// stale build-time cache (see app/page.tsx for the same reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `EC 활동 설계 | ${settings.academy_name}`,
    description: "성적만으로는 설명되지 않는 지원자를 만드는 활동 설계 서비스입니다.",
  };
}

export default async function ActivitiesPage() {
  const [settings, popups] = await Promise.all([
    getSiteSettings(),
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
      />
      <PageHeader
        eyebrow="ACTIVITIES"
        title="EC 활동 설계"
        lead="성적만으로는 설명되지 않는 지원자를 만듭니다."
      />
      <EcServices />
      <Footer settings={settings} />
    </>
  );
}
