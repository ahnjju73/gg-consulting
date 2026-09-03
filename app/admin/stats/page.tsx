import { createAdminClient } from "@/lib/supabase/admin";
import type { Stat, StatGroup } from "@/lib/types";
import { createStat, updateStat, deleteStat } from "./actions";

export const dynamic = "force-dynamic";

async function getAllStats(): Promise<Stat[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Stat[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";

function StatGroupSection({
  title,
  hint,
  group,
  items,
}: {
  title: string;
  hint: string;
  group: StatGroup;
  items: Stat[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="text-xs text-slate-500 mt-0.5">{hint}</p>

      <div className="mt-4 space-y-3">
        {items.map((stat) => (
          <form
            action={updateStat}
            key={stat.id}
            className="flex flex-wrap items-end gap-2 rounded-md border border-slate-100 bg-slate-50 p-3"
          >
            <input type="hidden" name="id" value={stat.id} />
            <div className="w-16">
              <label className="block text-xs text-slate-500 mb-1">순서</label>
              <input
                className={input}
                type="number"
                name="sort_order"
                defaultValue={stat.sort_order}
              />
            </div>
            <div className="w-28">
              <label className="block text-xs text-slate-500 mb-1">값</label>
              <input className={input} name="value" defaultValue={stat.value} />
            </div>
            <div className="flex-1 min-w-[10rem]">
              <label className="block text-xs text-slate-500 mb-1">라벨</label>
              <input className={input} name="label" defaultValue={stat.label} />
            </div>
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              저장
            </button>
            <button
              formAction={deleteStat}
              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </form>
        ))}
      </div>

      <form
        action={createStat}
        className="mt-4 flex flex-wrap items-end gap-2 rounded-md border border-dashed border-slate-300 p-3"
      >
        <input type="hidden" name="group_name" value={group} />
        <div className="w-16">
          <label className="block text-xs text-slate-500 mb-1">순서</label>
          <input className={input} type="number" name="sort_order" defaultValue={items.length + 1} />
        </div>
        <div className="w-28">
          <label className="block text-xs text-slate-500 mb-1">값</label>
          <input className={input} name="value" placeholder="예: 95%" required />
        </div>
        <div className="flex-1 min-w-[10rem]">
          <label className="block text-xs text-slate-500 mb-1">라벨</label>
          <input className={input} name="label" placeholder="예: 합격률" required />
        </div>
        <button
          type="submit"
          className="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
        >
          + 추가
        </button>
      </form>
    </div>
  );
}

export default async function StatsPage() {
  const all = await getAllStats();
  const hero = all.filter((s) => s.group_name === "hero");
  const results = all.filter((s) => s.group_name === "results");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">통계 숫자</h1>
      <p className="mt-2 text-sm text-slate-500">
        히어로 영역과 입학성과 영역에 표시되는 숫자 카드입니다.
      </p>

      <div className="mt-8 space-y-6">
        <StatGroupSection
          title="히어로 영역 (상단 3개)"
          hint="페이지 최상단, 소개 문구 옆에 표시됩니다."
          group="hero"
          items={hero}
        />
        <StatGroupSection
          title="입학성과 영역 (강사진 아래 밴드)"
          hint="어두운 배경의 통계 밴드에 표시됩니다."
          group="results"
          items={results}
        />
      </div>
    </div>
  );
}
