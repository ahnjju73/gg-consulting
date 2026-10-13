import Reveal from "./Reveal";

export default function EcDetail({ items }: { items: string[] }) {
  return (
    <section id="ec-detail">
      <div className="wrap">
        <Reveal className="ec-detail-card">
          <ul>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
