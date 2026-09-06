"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Popup } from "@/lib/types";

const HIDE_KEY_PREFIX = "gg-popup-hide-until:";
const HIDE_HOURS = 24;

function readHideUntil(id: string): number {
  try {
    const raw = window.localStorage.getItem(HIDE_KEY_PREFIX + id);
    return raw ? Number(raw) : 0;
  } catch {
    // localStorage can throw in private/blocked-storage browsers — treat as
    // "nothing hidden" rather than crashing the popup.
    return 0;
  }
}

function writeHideUntil(id: string, until: number) {
  try {
    window.localStorage.setItem(HIDE_KEY_PREFIX + id, String(until));
  } catch {
    // Ignore — worst case the popup shows again next time.
  }
}

export default function Popups({ popups }: { popups: Popup[] }) {
  // Portal target only exists on the client, so gate rendering behind a
  // mount flag (same SSR-safe pattern used by MobileMenu).
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // The queue of popups still eligible to show this load, minus whichever
  // ones the visitor has already dismissed with "24시간 동안 보지 않기".
  const [queue, setQueue] = useState<Popup[]>([]);
  useEffect(() => {
    const now = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueue(popups.filter((p) => readHideUntil(p.id) < now));
    // Popup content is decided at page-load; re-filtering when `popups`
    // changes identity (e.g. after a revalidate) is intentional.
  }, [popups]);

  const current = queue[0];

  const dismiss = useMemo(
    () => () => setQueue((q) => q.slice(1)),
    []
  );

  const hideForADay = () => {
    if (!current) return;
    writeHideUntil(current.id, Date.now() + HIDE_HOURS * 60 * 60 * 1000);
    dismiss();
  };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [current, dismiss]);

  if (!mounted || !current) return null;

  return createPortal(
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-backdrop" onClick={dismiss} aria-hidden="true" />
      <div className="popup-modal">
        {current.link_url ? (
          <a
            href={current.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="popup-image-link"
            onClick={dismiss}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image_url} alt={current.title ?? "공지"} />
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.image_url}
            alt={current.title ?? "공지"}
            onClick={dismiss}
            role="button"
            tabIndex={0}
          />
        )}
        <div className="popup-actions">
          <button type="button" onClick={hideForADay}>
            24시간 동안 보지 않기
          </button>
          <button type="button" onClick={dismiss} className="popup-close">
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
