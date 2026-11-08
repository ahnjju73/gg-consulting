import { createAdminClient } from "@/lib/supabase/admin";
import type { WinterCampCourse } from "@/lib/types";
import {
  createWinterCampCourse,
  updateWinterCampCourse,
  deleteWinterCampCourse,
} from "./actions";

export const dynamic = "force-dynamic";

async function getCourses(): Promise<WinterCampCourse[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("winter_camp_courses")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WinterCampCourse[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const fileInput =
  "block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white file:text-xs";

export default async function WinterCampAdminPage() {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">겨울방학 특강</h1>
      <p className="mt-2 text-sm text-slate-500">
        /winter-camp 페이지에 뜨는 수업 카드입니다. 메뉴에 뜨는 이름(예:
        &quot;2027 겨울방학 특강&quot;)과 메뉴 노출 여부는{" "}
        <a href="/admin/settings" className="underline">
          사이트 설정
        </a>
        에서 바꿀 수 있습니다. 각 카드의 &quot;수업소개&quot; 버튼을 누르면
        여기서 올린 사진 한 장만 보여주는 페이지로 이동합니다 — 수업명/강사만
        먼저 등록하고 사진은 나중에 올려도 됩니다.
      </p>

      <div className="mt-8 space-y-4">
        {courses.map((c) => (
          <form
            action={updateWinterCampCourse}
            key={c.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={c.id} />
            <input
              type="hidden"
              name="current_image_url"
              value={c.image_url ?? ""}
            />
            <div className="flex gap-4 items-start">
              {c.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image_url}
                  alt={c.course_name}
                  className="w-20 h-20 rounded-md object-cover shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-md shrink-0 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center px-1">
                  사진 없음
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-3 flex-1">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">순서</label>
                  <input
                    className={input}
                    type="number"
                    name="sort_order"
                    defaultValue={c.sort_order}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">수업 이름</label>
                  <input
                    className={input}
                    name="course_name"
                    defaultValue={c.course_name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">강사 이름</label>
                  <input
                    className={input}
                    name="teacher_name"
                    defaultValue={c.teacher_name}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                수업소개 사진 {c.image_url ? "교체" : "업로드"} (선택)
              </label>
              <input type="file" name="image" accept="image/*" className={fileInput} />
              <p className="mt-1 text-xs text-slate-400">최대 4MB까지 업로드 가능</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                저장
              </button>
              <button
                formAction={deleteWinterCampCourse}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
        {courses.length === 0 && (
          <p className="text-sm text-slate-400">등록된 수업이 없습니다.</p>
        )}
      </div>

      <form
        action={createWinterCampCourse}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">수업 추가</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={courses.length + 1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">수업 이름</label>
            <input className={input} name="course_name" placeholder="예: AP Calculus AB/BC" required />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">강사 이름</label>
            <input className={input} name="teacher_name" placeholder="예: 송나라 부원장님" required />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            수업소개 사진 (선택 — 나중에 올려도 됩니다)
          </label>
          <input type="file" name="image" accept="image/*" className={fileInput} />
          <p className="mt-1 text-xs text-slate-400">최대 4MB까지 업로드 가능</p>
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
