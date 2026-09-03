import type { Testimonial } from "@/lib/types";
import Reveal from "./Reveal";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section>
      <div className="wrap">
        <Reveal>
          {testimonials.map((t) => (
            <div className="testimonial" key={t.id}>
              <blockquote>{t.quote}</blockquote>
              <cite>{t.author}</cite>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
