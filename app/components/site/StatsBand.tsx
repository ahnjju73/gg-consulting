import type { Stat } from "@/lib/types";

export default function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats-band" id="results">
      <div className="wrap">
        {stats.map((s) => (
          <div className="stat reveal in" key={s.id}>
            <b className="mono">{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
