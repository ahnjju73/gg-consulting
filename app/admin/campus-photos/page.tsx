import { createAdminClient } from "@/lib/supabase/admin";
import type { CampusPhoto, CampusPhotoPosition } from "@/lib/types";
import { updateCampusPhoto } from "./actions";

export const dynamic = "force-dynamic";

// Fixed display order — matches where each slot actually sits on the page
// (see app/page.tsx), independent of whatever order Supabase returns rows in.
const SLOTS: { position: CampusPhotoPosition; where: string }[] = [
  { position: "after_hero", where: "히어로 섹션 바로 다음" },
  { position: "after_programs", where: "프로그램 트랙 섹션 다음" },
  { position: "after_faculty", where: "강사진 섹션 다음" },
];

async function getCampusPhotos(): Promise<Record<string, CampusPhoto>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("campus_photos").select("*");
  if (error) throw error;
  const rows = (data ?? []) as CampusPhoto[];
  return Object.fromEntries(rows.map((r) => [r.position, r]));
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const fileInput =
  "block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white file:text-xs";

export default async function CampusPhotosPage() {
  const photos = await getCampusPhotos();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">캠퍼스 사진</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xl">
        하버드·예일·스탠포드처럼 학생들이 진학한(또는 목표로 하는) 대학 캠퍼스
        사진을 홈페이지 섹션 사이사이에 화면 전체 너비로 크게 보여주는
        기능입니다. 위치는 아래 3곳으로 고정되어 있고, 각 자리마다 사진 교체 ·
        대학명/위치/문구 수정 · &ldquo;표시 여부&rdquo;를 따로 설정할 수
        있습니다. 사진을 아직 올리지 않았거나 &ldquo;표시&rdquo;를 꺼두면 해당
        자리는 사이트에서 그냥 보이지 않습니다(빈 공간이 남지 않습니다).
      </p>

      <div className="mt-8 space-y-4">
        {SLOTS.map(({ position, where }) => {
          const p = photos[position];
          if (!p) return null;
          return (
            <form
              action={updateCampusPhoto}
              key={position}
              className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
            >
              <input type="hidden" name="position" value={position} />
              <input
                type="hidden"
                name="current_image_url"
                value={p.image_url ?? ""}
              />
              <div className="flex gap-4 items-start">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.university}
                    className="w-28 h-20 rounded-md object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-28 h-20 rounded-md shrink-0 border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400 text-center px-1">
                    사진 없음
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-xs font-medium text-amber-700">
                    {where}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 mt-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        대학명
                      </label>
                      <input
                        className={input}
                        name="university"
                        defaultValue={p.university}
                        placeholder="예: Harvard"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        위치 (선택)
                      </label>
                      <input
                        className={input}
                        name="location"
                        defaultValue={p.location ?? ""}
                        placeholder="예: Cambridge, MA"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  문구 (선택 — 사진 위에 작은 설명으로 표시)
                </label>
                <textarea
                  className={input}
                  name="caption"
                  rows={2}
                  defaultValue={p.caption ?? ""}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  사진 교체
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className={fileInput}
                />
                <p className="mt-1 text-xs text-slate-400">
                  가로로 넓은 사진일수록 잘 어울립니다 (최대 4MB까지 업로드
                  가능)
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={p.active}
                  className="rounded border-slate-300"
                />
                표시 (visible) — 꺼두면(invisible) 사진이 있어도 사이트에
                숨겨집니다
              </label>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                저장
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
