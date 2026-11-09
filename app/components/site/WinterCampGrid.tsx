import Link from "next/link";
import type { WinterCampCategory, WinterCampCourse } from "@/lib/types";
import Reveal from "./Reveal";

// "N회 · N시간" — both fields are optional (a course can be registered
// before its schedule is finalized), so the line renders only the pieces
// that are actually filled in, and not at all when neither is set.
function formatMeta(c: WinterCampCourse): string | null {
  const parts: string[] = [];
  if (c.sessions_count) parts.push(`${c.sessions_count}회`);
  if (c.total_hours) parts.push(`${c.total_hours}시간`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default function WinterCampGrid({
  categories,
  courses,
}: {
  categories: WinterCampCategory[];
  courses: WinterCampCourse[];
}) {
  // Group courses under their category, in category sort order. A course
  // whose category was deleted (or never set) falls into "기타", shown
  // last and only when it actually has members.
  const byCategory = new Map<string, WinterCampCourse[]>();
  const uncategorized: WinterCampCourse[] = [];
  for (const course of courses) {
    if (course.category_id) {
      const list = byCategory.get(course.category_id) ?? [];
      list.push(course);
      byCategory.set(course.category_id, list);
    } else {
      uncategorized.push(course);
    }
  }

  const groups = [
    ...categories.map((cat) => ({
      key: cat.id,
      label: cat.name,
      courses: byCategory.get(cat.id) ?? [],
    })),
    ...(uncategorized.length > 0
      ? [{ key: "uncategorized", label: "기타", courses: uncategorized }]
      : []),
  ].filter((g) => g.courses.length > 0);

  if (groups.length === 0) {
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
        {groups.map((g) => (
          <Reveal className="winter-category" key={g.key}>
            <div className="winter-category-head">
              <h2>{g.label}</h2>
              <span className="count">{g.courses.length}개 수업</span>
            </div>
            <div className="winter-grid">
              {g.courses.map((c, i) => {
                const meta = formatMeta(c);
                return (
                  <Link
                    className="winter-card"
                    href={`/winter-camp/${c.id}`}
                    key={c.id}
                  >
                    <span className="ghost-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{c.course_name}</h3>
                    {meta && <div className="winter-card-meta">{meta}</div>}
                    <div className="winter-card-teacher">
                      <span>{c.teacher_name}</span>
                    </div>
                    <span className="winter-card-explore">수업소개 →</span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
