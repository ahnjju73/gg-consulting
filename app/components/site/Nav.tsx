export default function Nav({
  logoMain,
  logoAccent,
  logoUrl,
}: {
  logoMain: string;
  logoAccent: string;
  logoUrl: string | null;
}) {
  return (
    <header className="nav">
      <div className="nav-row">
        <div className="logo">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${logoMain}${logoAccent}`} className="logo-mark" />
          ) : null}
          {logoMain}
          <span>{logoAccent}</span>
          <small>&nbsp;Consulting</small>
        </div>
        <nav className="links">
          <a href="#mission">소개</a>
          <a href="#programs">프로그램</a>
          <a href="#faculty">강사진</a>
          <a href="#results">입학성과</a>
          <a href="#contact">상담문의</a>
        </nav>
        <a className="cta-pill" href="#contact">
          상담 신청
        </a>
      </div>
    </header>
  );
}
