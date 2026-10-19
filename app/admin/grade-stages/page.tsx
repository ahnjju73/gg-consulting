import { createAdminClient } from "@/lib/supabase/admin";
import type { GradeStage } from "@/lib/types";
import { createGradeStage, updateGradeStage, deleteGradeStage } from "./actions";

export const dynamic = "force-dynamic";

async function getGradeStages(): Promise<GradeStage[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("grade_stages")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GradeStage[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";

export default async function GradeStagesPage() {
  const stages = await getGradeStages();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">학년별 가이드</h1>
      <p className="mt-2 text-sm text-slate-500">
        /수업 페이지의 &quot;학년별로 받는 수업이 다릅니다&quot; 탭 섹션입니다.
        방문자가 탭을 클릭하면 선택한 단계의 설명과 불릿 항목이 바뀝니다.
        불릿 항목은 한 줄에 하나씩 입력하고, &quot;레이블 — 설명&quot; 형식으로
        쓰면 레이블 부분이 굵게 표시됩니다 (대시 없이 쓰면 그냥 일반 텍스트로
        나옵니다).
      </p>

      <div className="mt-8 space-y-4">
        {stages.map((s) => (
          <form
            action={updateGradeStage}
            key={s.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={s.id} />
            <div className="text-xs text-slate-400">slug: {s.slug}</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">순서</label>
                <input
                  className={input}
                  type="number"
                  name="sort_order"
                  defaultValue={s.sort_order}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">
                  학년 태그 (예: 저학년, 9–10학년)
                </label>
                <input className={input} name="grade_tag" defaultValue={s.grade_tag} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                단계 이름 (탭 제목)
              </label>
              <input className={input} name="title" defaultValue={s.title} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                설명 (패널 상단 소개 문장)
              </label>
              <textarea
                className={input}
                name="description"
                rows={2}
                defaultValue={s.description}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                불릿 항목 (한 줄에 하나씩, &quot;레이블 — 설명&quot; 권장)
              </label>
              <textarea
                className={input}
                name="items"
                rows={5}
                defaultValue={s.items.join("\n")}
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
                formAction={deleteGradeStage}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createGradeStage}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">새 단계 추가</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={stages.length + 1}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">slug</label>
            <input className={input} name="slug" placeholder="예: gap-year" required />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            학년 태그 (예: 저학년, 9–10학년)
          </label>
          <input className={input} name="grade_tag" required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">단계 이름 (탭 제목)</label>
          <input className={input} name="title" required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            설명 (패널 상단 소개 문장)
          </label>
          <textarea className={input} name="description" rows={2} required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            불릿 항목 (한 줄에 하나씩, &quot;레이블 — 설명&quot; 권장)
          </label>
          <textarea className={input} name="items" rows={4} />
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
