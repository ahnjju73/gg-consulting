import Reveal from "./Reveal";

const LINKS = [
  {
    href: "/curriculum",
    title: "수업",
    description: "입시 컨설팅과 시험 준비, 두 트랙의 전체 커리큘럼을 확인하세요.",
  },
  {
    href: "/faculty",
    title: "선생님 소개",
    description: "입학사정관 출신 컨설턴트와 각 과목 만점 강사진을 만나보세요.",
  },
  {
    href: "/activities",
    title: "EC 활동 설계",
    description: "성적 너머의 서사를 만드는 활동 설계 서비스를 소개합니다.",
  },
];

export default function ExploreLinks() {
  return (
    <section id="explore">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">EXPLORE</div>
          <h2>더 자세히 살펴보기</h2>
          <p>프로그램, 강사진, 활동 설계까지 — 각 페이지에서 자세히 안내합니다.</p>
        </Reveal>
        <Reveal className="explore-grid">
          {LINKS.map((l) => (
            <a className="explore-card" href={l.href} key={l.href}>
              <h3>{l.title}</h3>
              <p>{l.description}</p>
              <span className="explore-link">자세히 보기 →</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
