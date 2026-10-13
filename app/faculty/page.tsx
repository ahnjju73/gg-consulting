import type { Metadata } from "next";
import Nav from "../components/site/Nav";
import PageHeader from "../components/site/PageHeader";
import Faculty from "../components/site/Faculty";
import Contact from "../components/site/Contact";
import Footer from "../components/site/Footer";
import Popups from "../components/site/Popups";
import { getSiteSettings, getFaculty, getActivePopups } from "@/lib/queries";

// Faculty roster is admin-editable from /admin — never serve this from a
// stale build-time cache (see app/page.tsx for the same reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `선생님 소개 | ${settings.academy_name}`,
    description: "입학사정관 출신 컨설턴트와 각 과목 만점 강사진을 소개합니다.",
  };
}

export default async function FacultyPage() {
  const [settings, faculty, popups] = await Promise.all([
    getSiteSettings(),
    getFaculty(),
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
        eyebrow="FACULTY"
        title="선생님 소개"
        lead="가르치는 사람이 아니라, 함께 설계하는 사람입니다."
      />
      <Faculty faculty={faculty} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
