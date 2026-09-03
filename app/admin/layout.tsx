import Link from "next/link";

const sections = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/settings", label: "사이트 설정" },
  { href: "/admin/stats", label: "통계 숫자" },
  { href: "/admin/pillars", label: "네 가지 원칙" },
  { href: "/admin/tracks", label: "프로그램 트랙" },
  { href: "/admin/faculty", label: "강사진" },
  { href: "/admin/testimonials", label: "학부모 후기" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center border-b border-amber-200">
        ⚠️ 이 관리자 페이지는 아직 로그인 보호가 없습니다. 배포 전 반드시 인증을
        추가하세요 (README 참고).
      </div>
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
          <div className="px-5 py-5 border-b border-slate-100">
            <Link href="/" className="font-semibold text-slate-900">
              GoldenGate <span className="text-amber-700">관리자</span>
            </Link>
            <p className="text-xs text-slate-400 mt-1">Content Manager</p>
          </div>
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 py-3 gap-1 text-sm">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="mt-2 px-3 py-2 rounded-md text-amber-700 hover:bg-amber-50 whitespace-nowrap"
            >
              사이트 보기 ↗
            </Link>
          </nav>
        </aside>
        <main className="flex-1 px-4 py-8 md:px-10 md:py-10 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
