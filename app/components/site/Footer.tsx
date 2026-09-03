import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap foot-row">
        <div>
          <div className="logo">
            {settings.logo_text_main}
            <span>{settings.logo_text_accent}</span>
          </div>
          <div className="foot-legal">
            상호 {settings.academy_name} · 대표 {settings.representative_name}
            <br />
            {settings.address} · 사업자등록번호 {settings.business_reg_no}
            <br />
            학원 등록번호 {settings.academy_license_no} · © {year}{" "}
            {settings.academy_name}. All rights reserved.
          </div>
        </div>
        <div className="foot-links">
          <a href="#mission">소개</a>
          <a href="#programs">프로그램</a>
          <a href="#faculty">강사진</a>
          <a href="#contact">상담문의</a>
        </div>
      </div>
    </footer>
  );
}
