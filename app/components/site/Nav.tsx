import MobileMenu from "./MobileMenu";

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
          <a href="#mission">소개</a>
          <a href="#programs">프로그램</a>
          <a href="#faculty">강사진</a>
          {showResults && <a href="#results">입학성과</a>}
          <a href="#contact">상담문의</a>
        </nav>
        <div className="nav-actions">
          <a className="cta-pill" href="#contact">
            상담 신청
          </a>
          <MobileMenu showResults={showResults} />
        </div>
      </div>
    </header>
  );
}
