import { createAdminClient } from "@/lib/supabase/admin";
import type { FacultyMember } from "@/lib/types";
import { createFaculty, updateFaculty, deleteFaculty } from "./actions";

export const dynamic = "force-dynamic";

async function getFaculty(): Promise<FacultyMember[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FacultyMember[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const fileInput =
  "block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white file:text-xs";

export default async function FacultyPage() {
  const faculty = await getFaculty();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">강사진</h1>
      <p className="mt-2 text-sm text-slate-500">
        사진을 올리지 않으면 이름 이니셜로 된 아바타가 표시됩니다.
      </p>

      <div className="mt-8 space-y-4">
        {faculty.map((f) => (
          <form
            action={updateFaculty}
            key={f.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={f.id} />
            <div className="flex gap-4 items-start">
              {f.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.avatar_url}
                  alt={f.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
              )}
              <div className="grid gap-3 sm:grid-cols-2 flex-1">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">순서</label>
                  <input
                    className={input}
                    type="number"
                    name="sort_order"
                    defaultValue={f.sort_order}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">이름</label>
                  <input className={input} name="name" defaultValue={f.name} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                역할 (한 줄에 하나씩, 여러 개 가능)
              </label>
              <textarea
                className={input}
                name="roles"
                rows={2}
                defaultValue={f.roles.join("\n")}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                대학 (선택 — 비워두면 카드에 표시되지 않음)
              </label>
              <input
                className={input}
                name="university"
                placeholder="예: Harvard University"
                defaultValue={f.university ?? ""}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">소개</label>
              <textarea
                className={input}
                name="bio"
                rows={2}
                defaultValue={f.bio ?? ""}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                사진 교체 (선택)
              </label>
              <input type="file" name="avatar" accept="image/*" className={fileInput} />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                저장
              </button>
              <button
                formAction={deleteFaculty}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createFaculty}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">강사 추가</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={faculty.length + 1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">이름</label>
            <input className={input} name="name" required />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            역할 (한 줄에 하나씩, 여러 개 가능)
          </label>
          <textarea className={input} name="roles" rows={2} required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            대학 (선택 — 비워두면 카드에 표시되지 않음)
          </label>
          <input className={input} name="university" placeholder="예: Harvard University" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">소개</label>
          <textarea className={input} name="bio" rows={2} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">사진 (선택)</label>
          <input type="file" name="avatar" accept="image/*" className={fileInput} />
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
