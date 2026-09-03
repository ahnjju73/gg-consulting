import type { SiteSettings, Stat } from "@/lib/types";
import BridgeCable from "./BridgeCable";

export default function Hero({
  settings,
  stats,
}: {
  settings: SiteSettings;
  stats: Stat[];
}) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">
              {settings.academy_name} · Since {settings.since_year}
            </div>
            <h1>
              {settings.hero_title_line1}
              <br />
              <em>{settings.hero_title_line2}</em>
            </h1>
            <p className="hero-sub">{settings.hero_description}</p>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">
                1:1 진단 상담 신청 →
              </a>
              <a className="btn-ghost" href="#programs">
                프로그램 살펴보기
              </a>
            </div>
          </div>
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.id}>
                <b className="mono">{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cable-wrap">
          <BridgeCable />
        </div>
      </div>
    </section>
  );
}
