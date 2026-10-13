import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { EC_SERVICES } from "./ecServicesData";

export default function Nav({
  logoMain,
  logoAccent,
  logoUrl,
  showResults,
}: {
  logoMain: string;
  logoAccent: string;
  logoUrl: string | null;
  showResults: boolean;
}) {
  return (
    <header className="nav">
      <div className="nav-row">
        <div className="logo">
          {logoUrl ? (
            // An uploaded logo image is a full lockup (icon + wordmark) on
            // its own, so it REPLACES the text lockup entirely rather than
            // sitting next to it — otherwise the brand name renders twice.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${logoMain}${logoAccent}`}
              className="logo-mark-full"
            />
          ) : (
            <>
              {logoMain}
              <span>{logoAccent}</span>
              <small>&nbsp;Consulting</small>
            </>
          )}
        </div>
        <nav className="links">
          <Link href="/#mission">소개</Link>
          <Link href="/faculty">선생님 소개</Link>
          <Link href="/curriculum">수업</Link>
          <div className="nav-dropdown">
            <Link href="/activities">EC</Link>
            <div className="nav-dropdown-menu">
              {EC_SERVICES.map((s) => (
                <Link href={`/activities/${s.slug}`} key={s.slug}>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
          {showResults && <Link href="/#results">입학성과</Link>}
          <Link href="/#contact">상담문의</Link>
        </nav>
        <div className="nav-actions">
          <Link className="cta-pill" href="/#contact">
            상담 신청
          </Link>
          <MobileMenu showResults={showResults} />
        </div>
      </div>
    </header>
  );
}
