import { createAdminClient } from "@/lib/supabase/admin";
import type { Track } from "@/lib/types";
import { createTrack, updateTrack, deleteTrack } from "./actions";

export const dynamic = "force-dynamic";

async function getTracks(): Promise<Track[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Track[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const select = input;

export default async function TracksPage() {
  const tracks = await getTracks();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">프로그램 트랙</h1>
      <p className="mt-2 text-sm text-slate-500">
        &quot;두 개의 트랙, 하나의 로드맵&quot; 섹션입니다. 불릿 항목은 한 줄에
        하나씩 입력하세요. 디자인은 정확히 2개 트랙일 때 가운데 타워 장식이
        표시됩니다.
      </p>

      <div className="mt-8 space-y-4">
        {tracks.map((t) => (
          <form
            action={updateTrack}
            key={t.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={t.id} />
            <div className="text-xs text-slate-400">slug: {t.slug}</div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">순서</label>
                <input
                  className={input}
                  type="number"
                  name="sort_order"
                  defaultValue={t.sort_order}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Eyebrow
                </label>
                <input className={input} name="eyebrow" defaultValue={t.eyebrow} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">
                  강조 색상
                </label>
                <select className={select} name="color" defaultValue={t.color}>
                  <option value="gold">골드 (첫 번째 트랙 스타일)</option>
                  <option value="bay">베이 블루 (두 번째 트랙 스타일)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">제목</label>
              <input className={input} name="title" defaultValue={t.title} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                한 줄 소개
              </label>
              <input className={input} name="lead" defaultValue={t.lead} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                불릿 항목 (한 줄에 하나씩)
              </label>
              <textarea
                className={input}
                name="items"
                rows={5}
                defaultValue={t.items.join("\n")}
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
                formAction={deleteTrack}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createTrack}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">새 트랙 추가</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={tracks.length + 1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">slug</label>
            <input className={input} name="slug" placeholder="예: summer-program" required />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Eyebrow</label>
            <input className={input} name="eyebrow" placeholder="TRACK 03" required />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">강조 색상</label>
            <select className={select} name="color" defaultValue="gold">
              <option value="gold">골드</option>
              <option value="bay">베이 블루</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">제목</label>
          <input className={input} name="title" required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">한 줄 소개</label>
          <input className={input} name="lead" required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            불릿 항목 (한 줄에 하나씩)
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
