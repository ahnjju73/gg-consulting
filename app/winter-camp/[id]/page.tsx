import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../components/site/Nav";
import PageHeader from "../../components/site/PageHeader";
import Footer from "../../components/site/Footer";
import Popups from "../../components/site/Popups";
import {
  getSiteSettings,
  getWinterCampCourse,
  getActivePopups,
} from "@/lib/queries";

// Settings + the course row are both admin-editable from /admin — never
// serve this from a stale build-time cache (see app/page.tsx for the same
// reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const settings = await getSiteSettings();
  const course = await getWinterCampCourse(id);
  if (!course) {
    return { title: `${settings.winter_camp_title} | ${settings.academy_name}` };
  }
  return {
    title: `${course.course_name} | ${settings.winter_camp_title} | ${settings.academy_name}`,
    description: `${course.teacher_name} 선생님 — ${course.course_name} 수업 소개`,
  };
}

export default async function WinterCampCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getWinterCampCourse(id);
  if (!course) notFound();

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
        winterCampTitle={settings.winter_camp_title}
        winterCampVisible={settings.winter_camp_nav_visible}
      />
      <PageHeader
        eyebrow={settings.winter_camp_title}
        title={course.course_name}
        lead={[
          `${course.teacher_name} 선생님`,
          course.sessions_count ? `${course.sessions_count}회` : null,
          course.total_hours ? `${course.total_hours}시간` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      />
      <section>
        <div className="wrap winter-detail">
          {course.image_url ? (
            <div className="winter-detail-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={course.image_url} alt={`${course.course_name} 수업소개`} />
            </div>
          ) : (
            <div className="winter-detail-empty">
              수업소개 이미지가 아직 준비 중입니다.
            </div>
          )}
        </div>
      </section>
      <Footer settings={settings} />
    </>
  );
}
