import Reveal from "./Reveal";

// Static copy for now — this page is new content that doesn't live in
// Supabase yet (no admin-editable table for it). If this needs to be
// editable from /admin later without a code change, add an `ec_services`
// table + admin page the same way `pillars` works, then swap this array
// for a `getEcServices()` query.
const SERVICES = [
  {
    title: "활동 포지셔닝 설계",
    description:
      "전공 방향에 맞춰 9–10학년부터 시작하는 장기 활동 로드맵을 설계합니다.",
  },
  {
    title: "리서치 & 프로젝트",
    description: "관심 분야의 개인 프로젝트를 기획부터 완성까지 함께 만들어갑니다.",
  },
  {
    title: "공모전 & 대회 준비",
    description: "전공과 연결되는 국내외 대회를 추천하고 출전을 준비합니다.",
  },
  {
    title: "여름 프로그램",
    description: "서머스쿨·프로그램 지원 전략을 세우고 합격까지 지도합니다.",
  },
  {
    title: "봉사 & 리더십",
    description:
      "일회성이 아닌, 서사로 이어지는 봉사활동과 리더십 포지션을 설계합니다.",
  },
  {
    title: "포트폴리오 구축",
    description: "활동 이력을 하나의 에세이 서사로 정리해 지원서에 연결합니다.",
  },
];

export default function EcServices() {
  return (
    <section id="ec-services">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">SERVICES</div>
          <h2>우리가 설계하는 활동들</h2>
          <p>대학은 성적 뒤에 있는 이야기를 봅니다. 그 이야기를 처음부터 함께 만듭니다.</p>
        </Reveal>
        <Reveal className="ec-grid">
          {SERVICES.map((s, i) => (
            <div className="ec-card" key={s.title}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
