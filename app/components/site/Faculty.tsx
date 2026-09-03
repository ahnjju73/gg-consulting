import type { FacultyMember } from "@/lib/types";
import Reveal from "./Reveal";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Faculty({ faculty }: { faculty: FacultyMember[] }) {
  return (
    <section id="faculty">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">FACULTY</div>
          <h2>10년 이상 경력의 전문 강사진</h2>
          <p>입학사정관 출신 컨설턴트와 각 과목 만점 강사진이 함께합니다.</p>
        </Reveal>
        <Reveal className="faculty-grid">
          {faculty.map((f) => (
            <div className="fac-card" key={f.id}>
              <div className="avatar">
                {f.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.avatar_url} alt={f.name} />
                ) : (
                  initials(f.name)
                )}
              </div>
              <h4>{f.name}</h4>
              <div className="role">{f.role}</div>
              {f.bio ? <p>{f.bio}</p> : null}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
