import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

const label = "block text-sm font-medium text-slate-700 mb-1";
const input =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";
const fieldset = "space-y-4 rounded-lg border border-slate-200 bg-white p-5";
const legend = "text-sm font-semibold text-slate-900 mb-1";

export default async function SettingsPage() {
  const s = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">사이트 설정</h1>
      <p className="mt-2 text-sm text-slate-500">
        홈페이지 전역에 쓰이는 텍스트와 연락처 정보입니다.
      </p>

      <form action={updateSettings} className="mt-8 space-y-6">
        <input type="hidden" name="current_logo_url" value={s.logo_url ?? ""} />
        <div className={fieldset}>
          <div className={legend}>로고 &amp; 학원명</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>학원 정식 명칭</label>
              <input
                className={input}
                name="academy_name"
                defaultValue={s.academy_name}
                required
              />
            </div>
            <div>
              <label className={label}>Since 연도</label>
              <input
                className={input}
                name="since_year"
                defaultValue={s.since_year}
              />
            </div>
            <div>
              <label className={label}>로고 텍스트 (메인)</label>
              <input
                className={input}
                name="logo_text_main"
                defaultValue={s.logo_text_main}
              />
            </div>
            <div>
              <label className={label}>로고 텍스트 (강조)</label>
              <input
                className={input}
                name="logo_text_accent"
                defaultValue={s.logo_text_accent}
              />
            </div>
          </div>
          <div>
            <label className={label}>로고 이미지 업로드 (선택)</label>
            {s.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.logo_url}
                alt="현재 로고"
                className="h-8 mb-2 rounded"
              />
            )}
            <input
              type="file"
              name="logo"
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white file:text-sm"
            />
            <p className="mt-1 text-xs text-slate-400">
              최대 4MB까지 업로드 가능합니다. 그보다 크면 사진을 압축한 뒤
              다시 올려주세요.
            </p>
          </div>
        </div>

        <div className={fieldset}>
          <div className={legend}>히어로 섹션</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>제목 1행</label>
              <input
                className={input}
                name="hero_title_line1"
                defaultValue={s.hero_title_line1}
              />
            </div>
            <div>
              <label className={label}>제목 2행 (강조, 골드 컬러)</label>
              <input
                className={input}
                name="hero_title_line2"
                defaultValue={s.hero_title_line2}
              />
            </div>
          </div>
          <div>
            <label className={label}>소개 문구</label>
            <textarea
              className={input}
              name="hero_description"
              rows={3}
              defaultValue={s.hero_description}
            />
          </div>
        </div>

        <div className={fieldset}>
          <div className={legend}>철학 / 미션 문구</div>
          <div>
            <label className={label}>인용문</label>
            <textarea
              className={input}
              name="philosophy_quote"
              rows={3}
              defaultValue={s.philosophy_quote}
            />
          </div>
          <div>
            <label className={label}>작성자 표기</label>
            <input
              className={input}
              name="philosophy_author"
              defaultValue={s.philosophy_author}
            />
          </div>
        </div>

        <div className={fieldset}>
          <div className={legend}>연락처 &amp; 상담 안내</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>전화번호</label>
              <input
                className={input}
                name="phone"
                defaultValue={s.phone ?? ""}
              />
            </div>
            <div>
              <label className={label}>이메일</label>
              <input
                className={input}
                name="email"
                defaultValue={s.email ?? ""}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>주소</label>
              <input
                className={input}
                name="address"
                defaultValue={s.address ?? ""}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>운영 시간</label>
              <input
                className={input}
                name="business_hours"
                defaultValue={s.business_hours ?? ""}
              />
            </div>
          </div>
        </div>

        <div className={fieldset}>
          <div className={legend}>사업자 / 법적 정보 (푸터에 표시)</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>대표자명</label>
              <input
                className={input}
                name="representative_name"
                defaultValue={s.representative_name ?? ""}
              />
            </div>
            <div>
              <label className={label}>사업자등록번호</label>
              <input
                className={input}
                name="business_reg_no"
                defaultValue={s.business_reg_no ?? ""}
              />
            </div>
            <div>
              <label className={label}>학원 등록번호</label>
              <input
                className={input}
                name="academy_license_no"
                defaultValue={s.academy_license_no ?? ""}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
