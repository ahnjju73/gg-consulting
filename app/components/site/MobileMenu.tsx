"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { EC_SERVICES } from "./ecServicesData";

const baseLinks = [
  { href: "/#mission", label: "소개" },
  { href: "/faculty", label: "선생님 소개" },
  { href: "/curriculum", label: "수업" },
];
const afterEcLinks = [
  { href: "/#results", label: "입학성과" },
  { href: "/#contact", label: "상담문의" },
];

export default function MobileMenu({
  showResults = true,
}: {
  showResults?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [ecOpen, setEcOpen] = useState(false);
  const trailingLinks = showResults
    ? afterEcLinks
    : afterEcLinks.filter((l) => l.href !== "/#results");
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
      // Collapse the EC submenu so it doesn't re-open already-expanded
      // next time the drawer opens.
      setEcOpen(false);
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
                {baseLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
                <div className="mobile-drawer-group">
                  <div className="mobile-drawer-group-row">
                    <Link href="/activities" onClick={() => setOpen(false)}>
                      EC
                    </Link>
                    <button
                      type="button"
                      className="mobile-drawer-toggle"
                      aria-expanded={ecOpen}
                      aria-label={ecOpen ? "EC 하위메뉴 닫기" : "EC 하위메뉴 열기"}
                      onClick={() => setEcOpen((v) => !v)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {ecOpen && (
                    <div className="mobile-drawer-submenu">
                      {EC_SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/activities/${s.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {trailingLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link
                className="btn-primary"
                href="/#contact"
                onClick={() => setOpen(false)}
              >
                상담 신청 →
              </Link>
            </aside>
          </>,
          document.body
        )}
    </>
  );
}
