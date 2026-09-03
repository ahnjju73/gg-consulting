import type { Pillar } from "@/lib/types";
import Reveal from "./Reveal";

export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section id="pillars-section">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">FOUR COMMITMENTS</div>
          <h2>골든게이트가 지키는 네 가지 원칙</h2>
          <p>모든 프로그램 설계의 기준이 되는 약속입니다.</p>
        </Reveal>
        <Reveal className="pillars">
          {pillars.map((p, i) => (
            <div className="pillar" key={p.id}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
