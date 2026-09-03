import type { SiteSettings } from "@/lib/types";
import Reveal from "./Reveal";

export default function Mission({ settings }: { settings: SiteSettings }) {
  return (
    <section className="mission" id="mission">
      <Reveal className="wrap">
        <div className="eyebrow">OUR PHILOSOPHY</div>
        <blockquote>{settings.philosophy_quote}</blockquote>
        <cite>{settings.philosophy_author}</cite>
      </Reveal>
    </section>
  );
}
