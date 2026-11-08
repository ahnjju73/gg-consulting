import Link from "next/link";
import type { WinterCampCourse } from "@/lib/types";
import Reveal from "./Reveal";

export default function WinterCampGrid({
  courses,
}: {
  courses: WinterCampCourse[];
}) {
  if (courses.length === 0) {
    return (
      <section>
        <div className="wrap">
          <p className="winter-empty">아직 등록된 수업이 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="wrap">
        <Reveal className="winter-grid">
          {courses.map((c, i) => (
            <div className="winter-card" key={c.id}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{c.course_name}</h3>
              <div className="teacher">{c.teacher_name}</div>
              <Link className="cta-pill" href={`/winter-camp/${c.id}`}>
                수업소개
              </Link>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
