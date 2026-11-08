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
        <Reveal className="winter-list">
          {courses.map((c, i) => (
            <Link className="winter-row" href={`/winter-camp/${c.id}`} key={c.id}>
              <div className="winter-row-text">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="winter-row-names">
                  <h3>{c.course_name}</h3>
                  <span className="teacher">{c.teacher_name}</span>
                </span>
              </div>
              <span className="winter-row-link">
                수업소개
                <span className="winter-row-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
