import { createAdminClient } from "@/lib/supabase/admin";
import type { Popup } from "@/lib/types";
import { createPopup, updatePopup, deletePopup } from "./actions";

export const dynamic = "force-dynamic";

async function getPopups(): Promise<Popup[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("popups")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Popup[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const fileInput =
  "block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white file:text-xs";

export default async function PopupsPage() {
  const popups = await getPopups();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">팝업 공지</h1>
      <p className="mt-2 text-sm text-slate-500">
        공지사항이나 입시 결과 이미지를 올리면 사이트 방문 시 팝업으로
        표시됩니다. 방문자가 이미지를 클릭하거나 &ldquo;닫기&rdquo;를 누르면
        사라지고, &ldquo;24시간 동안 보지 않기&rdquo;를 누르면 24시간 동안
        다시 뜨지 않습니다. &ldquo;활성화&rdquo;를 꺼두면 사이트에서 즉시
        숨길 수 있습니다. 여러 개를 동시에 활성화하면 순서대로 하나씩
        표시됩니다.
      </p>

      <div className="mt-8 space-y-4">
        {popups.map((p) => (
          <form
            action={updatePopup}
            key={p.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={p.id} />
            <div className="flex gap-4 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url}
                alt={p.title ?? "팝업 이미지"}
                className="w-20 h-20 rounded-md object-cover shrink-0 border border-slate-200"
              />
              <div className="grid gap-3 sm:grid-cols-2 flex-1">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">순서</label>
                  <input
                    className={input}
                    type="number"
                    name="sort_order"
                    defaultValue={p.sort_order}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    제목 (관리용, 화면에는 표시되지 않음)
                  </label>
                  <input className={input} name="title" defaultValue={p.title ?? ""} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                연결 링크 (선택 — 입력하면 이미지 클릭 시 새 탭으로 열림)
              </label>
              <input
                className={input}
                name="link_url"
                placeholder="https://..."
                defaultValue={p.link_url ?? ""}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                이미지 교체 (선택)
              </label>
              <input type="file" name="image" accept="image/*" className={fileInput} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="active"
                defaultChecked={p.active}
                className="rounded border-slate-300"
              />
              활성화 (사이트에 팝업으로 표시)
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                저장
              </button>
              <button
                formAction={deletePopup}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
        {popups.length === 0 && (
          <p className="text-sm text-slate-400">등록된 팝업이 없습니다.</p>
        )}
      </div>

      <form
        action={createPopup}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">팝업 추가</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={popups.length + 1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              제목 (관리용, 화면에는 표시되지 않음)
            </label>
            <input className={input} name="title" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            연결 링크 (선택 — 입력하면 이미지 클릭 시 새 탭으로 열림)
          </label>
          <input className={input} name="link_url" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">이미지</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className={fileInput}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="rounded border-slate-300"
          />
          활성화 (사이트에 팝업으로 표시)
        </label>
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
