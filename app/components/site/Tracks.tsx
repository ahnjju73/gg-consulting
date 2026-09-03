import type { Track } from "@/lib/types";
import Reveal from "./Reveal";

export default function Tracks({ tracks }: { tracks: Track[] }) {
  const showTower = tracks.length === 2;

  return (
    <section id="programs">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">PROGRAMS</div>
          <h2>두 개의 트랙, 하나의 로드맵</h2>
          <p>
            입시 컨설팅과 시험 준비는 따로 움직이지 않습니다. 하나의 팀이 두
            트랙을 함께 조율합니다.
          </p>
        </Reveal>
        <Reveal className="tracks">
          {showTower && (
            <svg className="tower" viewBox="0 0 34 60" aria-hidden="true">
              <rect x={15} y={0} width={4} height={60} fill="currentColor" opacity={0.5} />
              <rect x={0} y={0} width={34} height={4} fill="currentColor" opacity={0.5} />
            </svg>
          )}
          {tracks.map((track) => (
            <div className={`track ${track.color}`} key={track.id}>
              <div className="eyebrow">{track.eyebrow}</div>
              <h3>{track.title}</h3>
              <p className="lead">{track.lead}</p>
              <ul>
                {track.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
