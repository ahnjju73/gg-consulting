// Single source of truth for the EC (extracurricular) services: the
// overview grid (EcServices), the sub-nav (EcSubNav), and each detail
// page (app/activities/[slug]/page.tsx) all read from this list instead
// of repeating titles/descriptions in three places.
export type EcService = {
  slug: string;
  title: string;
  // Short enough for both the overview card and the detail page's lead.
  lead: string;
  // Detail bullet list shown on the service's own page.
  items: string[];
};

export const EC_SERVICES: EcService[] = [
  {
    slug: "positioning",
    title: "활동 포지셔닝 설계",
    lead: "전공 방향에 맞춰 9–10학년부터 시작하는 장기 활동 로드맵을 설계합니다.",
    items: [
      "학생의 관심사와 목표 전공을 함께 진단하고 우선순위를 정합니다.",
      "학년별로 어떤 활동을 언제 시작해야 하는지 로드맵을 그립니다.",
      "기존 활동과 새로 시작할 활동을 하나의 전공 서사로 연결합니다.",
      "매 학기 진행 상황을 점검하고 로드맵을 다시 조정합니다.",
    ],
  },
  {
    slug: "research",
    title: "리서치 & 프로젝트",
    lead: "관심 분야의 개인 프로젝트를 기획부터 완성까지 함께 만들어갑니다.",
    items: [
      "관심 주제를 좁혀 실행 가능한 프로젝트 질문으로 구체화합니다.",
      "리서치 설계, 자료 조사, 결과 정리까지 단계별로 지도합니다.",
      "완성된 프로젝트를 에세이와 포트폴리오에 연결되는 결과물로 정리합니다.",
      "필요한 경우 관련 분야 멘토·프로그램 연결을 지원합니다.",
    ],
  },
  {
    slug: "competitions",
    title: "공모전 & 대회 준비",
    lead: "전공과 연결되는 국내외 대회를 추천하고 출전을 준비합니다.",
    items: [
      "학생의 전공 방향과 수준에 맞는 대회를 선별해 추천합니다.",
      "출전 전략과 준비 일정을 함께 계획합니다.",
      "제출물(에세이·포트폴리오·발표 자료 등) 준비를 지도합니다.",
      "결과와 관계없이 경험을 서사로 정리해 지원서에 반영합니다.",
    ],
  },
  {
    slug: "summer-programs",
    title: "여름 프로그램",
    lead: "서머스쿨·프로그램 지원 전략을 세우고 합격까지 지도합니다.",
    items: [
      "목표와 일정에 맞는 서머 프로그램을 함께 조사하고 선별합니다.",
      "지원서·에세이·추천서 준비를 지도합니다.",
      "프로그램 참가 전후로 활동을 어떻게 연결할지 함께 계획합니다.",
    ],
  },
  {
    slug: "volunteering",
    title: "봉사 & 리더십",
    lead: "일회성이 아닌, 서사로 이어지는 봉사활동과 리더십 포지션을 설계합니다.",
    items: [
      "학생의 관심사와 연결되는 봉사 영역을 함께 찾습니다.",
      "단발성 활동이 아닌, 지속 가능한 활동으로 설계합니다.",
      "동아리·단체 내에서 리더십 포지션을 맡을 수 있는 경로를 함께 계획합니다.",
    ],
  },
  {
    slug: "portfolio",
    title: "포트폴리오 구축",
    lead: "활동 이력을 하나의 에세이 서사로 정리해 지원서에 연결합니다.",
    items: [
      "지금까지의 활동과 프로젝트를 한 곳에 정리합니다.",
      "활동들 사이의 공통된 주제·서사를 찾아 연결합니다.",
      "Common App 액티비티 리스트와 에세이에 쓸 소재로 다시 정리합니다.",
    ],
  },
];
