import Link from "next/link";
import type { WinterCampCourse } from "@/lib/types";
import Reveal from "./Reveal";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
            <Link className="winter-card" href={`/winter-camp/${c.id}`} key={c.id}>
              <span className="ghost-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{c.course_name}</h3>
              <div className="winter-card-teacher">
                <span className="winter-card-avatar">{initials(c.teacher_name)}</span>
                <span>{c.teacher_name}</span>
              </div>
              <span className="winter-card-explore">
                수업소개 →
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
