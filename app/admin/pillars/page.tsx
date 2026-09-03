import { createAdminClient } from "@/lib/supabase/admin";
import type { Pillar } from "@/lib/types";
import { createPillar, updatePillar, deletePillar } from "./actions";

export const dynamic = "force-dynamic";

async function getPillars(): Promise<Pillar[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Pillar[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";

export default async function PillarsPage() {
  const pillars = await getPillars();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">네 가지 원칙</h1>
      <p className="mt-2 text-sm text-slate-500">
        &quot;골든게이트가 지키는 네 가지 원칙&quot; 그리드 카드입니다. 4개로
        고정할 필요는 없습니다 — 추가/삭제 가능합니다.
      </p>

      <div className="mt-8 space-y-3">
        {pillars.map((p, i) => (
          <form
            action={updatePillar}
            key={p.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={p.id} />
            <div className="flex gap-3 items-start">
              <div className="w-14 shrink-0">
                <label className="block text-xs text-slate-500 mb-1">순서</label>
                <input
                  className={input}
                  type="number"
                  name="sort_order"
                  defaultValue={p.sort_order}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">
                  제목 ({String(i + 1).padStart(2, "0")}번으로 표시)
                </label>
                <input className={input} name="title" defaultValue={p.title} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">설명</label>
              <textarea
                className={input}
                name="description"
                rows={2}
                defaultValue={p.description}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                저장
              </button>
              <button
                formAction={deletePillar}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createPillar}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">새 원칙 추가</div>
        <div className="flex gap-3 items-start">
          <div className="w-14 shrink-0">
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={pillars.length + 1}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">제목</label>
            <input className={input} name="title" required />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">설명</label>
          <textarea className={input} name="description" rows={2} required />
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
