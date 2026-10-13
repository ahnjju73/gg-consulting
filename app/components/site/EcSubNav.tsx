"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EC_SERVICES } from "./ecServicesData";

export default function EcSubNav() {
  const pathname = usePathname();
  const items = [
    { href: "/activities", label: "전체보기" },
    ...EC_SERVICES.map((s) => ({ href: `/activities/${s.slug}`, label: s.title })),
  ];

  return (
    <nav className="ec-subnav">
      <div className="wrap">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
