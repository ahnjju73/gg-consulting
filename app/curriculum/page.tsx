import type { Metadata } from "next";
import Nav from "../components/site/Nav";
import PageHeader from "../components/site/PageHeader";
import Tracks from "../components/site/Tracks";
import Contact from "../components/site/Contact";
import Footer from "../components/site/Footer";
import Popups from "../components/site/Popups";
import { getSiteSettings, getTracks, getActivePopups } from "@/lib/queries";

// Tracks are admin-editable from /admin — never serve this from a stale
// build-time cache (see app/page.tsx for the same reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `수업 안내 | ${settings.academy_name}`,
    description: "입시 컨설팅과 시험 준비, 두 트랙의 전체 커리큘럼을 안내합니다.",
  };
}

export default async function CurriculumPage() {
  const [settings, tracks, popups] = await Promise.all([
    getSiteSettings(),
    getTracks(),
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
        eyebrow="CURRICULUM"
        title="수업"
        lead="입시의 시작부터 등록까지, 두 트랙이 하나의 팀 안에서 조율됩니다."
      />
      <Tracks tracks={tracks} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
