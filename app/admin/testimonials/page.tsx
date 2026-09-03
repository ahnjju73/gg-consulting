import { createAdminClient } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/types";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./actions";

export const dynamic = "force-dynamic";

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

const input =
  "w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">학부모 후기</h1>
      <p className="mt-2 text-sm text-slate-500">
        여러 개를 등록하면 홈페이지에 순서대로 나열됩니다.
      </p>

      <div className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <form
            action={updateTestimonial}
            key={t.id}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <input type="hidden" name="id" value={t.id} />
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
              <div className="sm:col-span-3">
                <label className="block text-xs text-slate-500 mb-1">
                  작성자 표기
                </label>
                <input className={input} name="author" defaultValue={t.author} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">인용문</label>
              <textarea
                className={input}
                name="quote"
                rows={3}
                defaultValue={t.quote}
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
                formAction={deleteTestimonial}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createTestimonial}
        className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 space-y-3"
      >
        <div className="text-sm font-semibold text-slate-900">후기 추가</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">순서</label>
            <input
              className={input}
              type="number"
              name="sort_order"
              defaultValue={testimonials.length + 1}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs text-slate-500 mb-1">
              작성자 표기
            </label>
            <input
              className={input}
              name="author"
              placeholder="예: 2026 합격생 학부모 · 익명"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">인용문</label>
          <textarea className={input} name="quote" rows={3} required />
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
