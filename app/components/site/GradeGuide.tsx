"use client";

import { useState } from "react";
import type { GradeStage } from "@/lib/types";
import Reveal from "./Reveal";

// Splits an item string on the first " — " into a bold label + the rest.
// Items without a dash (e.g. a closing summary line) render as plain text —
// same convention as tracks.items, just with optional bold leads.
function renderItem(item: string) {
  const idx = item.indexOf(" — ");
  if (idx === -1) return item;
  return (
    <>
      <b>{item.slice(0, idx)}</b>
      {item.slice(idx)}
    </>
  );
}

export default function GradeGuide({ stages }: { stages: GradeStage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stages[activeIndex];

  if (stages.length === 0) return null;

  return (
    <section>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">GRADE GUIDE</div>
          <h2>학년별로 받는 수업이 다릅니다</h2>
          <p>단계를 선택하면 그 시기에 어떤 수업을 듣는지 자세히 볼 수 있습니다.</p>
        </Reveal>

        <Reveal>
          <div className="stage-tabs" role="tablist">
            {stages.map((stage, i) => (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`stage-tab ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="grade-tag">{stage.grade_tag}</span>
                <span className="stage-title">{stage.title}</span>
              </button>
            ))}
          </div>

          {active && (
            <div className="stage-panel" role="tabpanel">
              <div className="stage-panel-head">
                <h3>{active.title}</h3>
                <p>{active.description}</p>
              </div>
              <ul>
                {active.items.map((item, i) => (
                  <li key={i}>{renderItem(item)}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
