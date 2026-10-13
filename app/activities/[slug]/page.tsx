import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../components/site/Nav";
import PageHeader from "../../components/site/PageHeader";
import EcSubNav from "../../components/site/EcSubNav";
import EcDetail from "../../components/site/EcDetail";
import Footer from "../../components/site/Footer";
import Popups from "../../components/site/Popups";
import { EC_SERVICES } from "../../components/site/ecServicesData";
import { getSiteSettings, getActivePopups } from "@/lib/queries";

// settings/popups are admin-editable from /admin — never serve this from a
// stale build-time cache (see app/page.tsx for the same reasoning).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();
  const service = EC_SERVICES.find((s) => s.slug === slug);
  if (!service) {
    return { title: `EC 활동 설계 | ${settings.academy_name}` };
  }
  return {
    title: `${service.title} | EC | ${settings.academy_name}`,
    description: service.lead,
  };
}

export default async function EcServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = EC_SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const [settings, popups] = await Promise.all([
    getSiteSettings(),
    getActivePopups(),
  ]);

  return (
    <>
      <Popups popups={popups} />
      <Nav
        logoMain={settings.logo_text_main}
        logoAccent={settings.logo_text_accent}
        logoUrl={settings.logo_url}
        showResults={settings.show_results_stats}
      />
      <PageHeader eyebrow="EC" title={service.title} lead={service.lead} />
      <EcSubNav />
      <EcDetail items={service.items} />
      <Footer settings={settings} />
    </>
  );
}
