import type { SiteSettings } from "@/lib/types";
import Reveal from "./Reveal";

export default function Contact({ settings }: { settings: SiteSettings }) {
  const telHref = settings.phone
    ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}`
    : undefined;

  return (
    <section id="contact">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">CONSULTATION</div>
          <h2>첫 상담은 진단부터 시작합니다</h2>
          <p>
            현재 성적, 목표 대학, 남은 시간을 함께 점검하고 로드맵 초안을
            제안해드립니다.
          </p>
        </Reveal>
        <Reveal className="contact-panel">
          <div className="contact-left">
            <h3>상담 예약 안내</h3>
            <p>
              아래 연락처로 문의 주시면 24시간 내 순번대로 예약을 도와드립니다.
              방문 상담은 사전 예약제로 운영됩니다.
            </p>
            {telHref && (
              <div className="contact-cta-row">
                <a className="btn-primary" href={telHref}>
                  전화 상담 신청 →
                </a>
                <a className="phone-link" href={telHref}>
                  ☎ {settings.phone}
                </a>
              </div>
            )}
          </div>
          <div className="contact-right">
            {settings.phone && (
              <div className="contact-item">
                <div className="ico">☎</div>
                <div>
                  <b>{settings.phone}</b>
                  <span>{settings.business_hours}</span>
                </div>
              </div>
            )}
            {settings.email && (
              <div className="contact-item">
                <div className="ico">✉</div>
                <div>
                  <b>{settings.email}</b>
                  <span>이메일 문의</span>
                </div>
              </div>
            )}
            {settings.address && (
              <div className="contact-item">
                <div className="ico">◎</div>
                <div>
                  <b>{settings.address}</b>
                  <span>방문 상담은 사전 예약제</span>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
