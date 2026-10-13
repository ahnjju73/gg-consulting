import Link from "next/link";
import Reveal from "./Reveal";
import { EC_SERVICES } from "./ecServicesData";

export default function EcServices() {
  return (
    <section id="ec-services">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">SERVICES</div>
          <h2>우리가 설계하는 활동들</h2>
          <p>대학은 성적 뒤에 있는 이야기를 봅니다. 그 이야기를 처음부터 함께 만듭니다.</p>
        </Reveal>
        <Reveal className="ec-grid">
          {EC_SERVICES.map((s, i) => (
            <Link className="ec-card" href={`/activities/${s.slug}`} key={s.slug}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p>{s.lead}</p>
              <span className="explore-link">자세히 보기 →</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
