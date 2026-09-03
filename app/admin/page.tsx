import Link from "next/link";

const cards = [
  {
    href: "/admin/settings",
    title: "사이트 설정",
    desc: "학원 이름, 로고, 히어로 카피, 철학 문구, 연락처, 사업자 정보",
  },
  {
    href: "/admin/stats",
    title: "통계 숫자",
    desc: "히어로 영역 3개 + 입학성과 영역 4개의 숫자/라벨",
  },
  {
    href: "/admin/pillars",
    title: "네 가지 원칙",
    desc: "\"네 가지 약속\" 그리드 카드 (제목 + 설명)",
  },
  {
    href: "/admin/tracks",
    title: "프로그램 트랙",
    desc: "입시 컨설팅 / 시험 준비 트랙, 각 트랙의 불릿 항목",
  },
  {
    href: "/admin/faculty",
    title: "강사진",
    desc: "이름, 역할, 소개, 사진 (사진 없으면 이니셜 아바타)",
  },
  {
    href: "/admin/testimonials",
    title: "학부모 후기",
    desc: "후기 인용문과 작성자 표기",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">관리자 대시보드</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xl">
        아래 섹션에서 홈페이지에 표시되는 콘텐츠를 추가, 수정, 삭제할 수
        있습니다. 저장하면 홈페이지에 바로 반영됩니다.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition"
          >
            <div className="font-medium text-slate-900">{c.title}</div>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
