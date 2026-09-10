import type { Metadata, Viewport } from "next";
import "./globals.css";

// Needed so relative image paths in openGraph/twitter metadata (e.g. the
// default share-preview image) resolve to a full URL for outside crawlers
// (KakaoTalk, etc). NEXT_PUBLIC_SITE_URL is optional — Vercel already sets
// VERCEL_URL to the deployment's own domain, so this works out of the box;
// set NEXT_PUBLIC_SITE_URL once a custom domain is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GoldenGate Consulting",
  description:
    "미국 대학 입시 컨설팅 및 SAT/AP 시험 준비 - GoldenGate Consulting",
};

// The site is dark-themed only (see globals.css) — this tells the browser
// chrome (address bar color, native form controls, scrollbars) to match
// instead of following the visitor's OS light/dark setting.
export const viewport: Viewport = {
  themeColor: "#0d131f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app-router root layout, not pages/_document; this loads once for every route. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Noto+Serif+KR:wght@400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
