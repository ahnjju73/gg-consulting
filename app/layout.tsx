import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldenGate Consulting",
  description:
    "미국 대학 입시 컨설팅 및 SAT/AP 시험 준비 - GoldenGate Consulting",
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
