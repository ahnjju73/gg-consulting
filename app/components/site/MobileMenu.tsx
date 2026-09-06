"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "#mission", label: "소개" },
  { href: "#programs", label: "프로그램" },
  { href: "#faculty", label: "강사진" },
  { href: "#results", label: "입학성과" },
  { href: "#contact", label: "상담문의" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  // The drawer/backdrop are portaled to <body> (see below) because
  // header.nav has `backdrop-filter`, which — like `transform` or `filter`
  // — creates a new containing block for `position: fixed` descendants.
  // Left nested inside the header, the drawer would size and position
  // itself against the header's small box instead of the viewport.
  const [mounted, setMounted] = useState(false);

  // Standard SSR-safe "mounted" flag: document.body doesn't exist during
  // the server render, so the portal target can only be resolved once
  // we're running on the client.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {mounted &&
        createPortal(
          <>
            <div
              className={`drawer-backdrop ${open ? "open" : ""}`}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <aside
              id="mobile-drawer"
              className={`mobile-drawer ${open ? "open" : ""}`}
              aria-hidden={!open}
            >
              <nav className="mobile-drawer-links">
                {links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                ))}
              </nav>
              <a
                className="btn-primary"
                href="#contact"
                onClick={() => setOpen(false)}
              >
                상담 신청 →
              </a>
            </aside>
          </>,
          document.body
        )}
    </>
  );
}
