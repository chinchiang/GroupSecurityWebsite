import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.about")} />
      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <p>
          <strong>{siteConfig.brandName}</strong> is an internal Cybersecurity
          Governance & Operations Portal (Experience / Orchestration Layer).
        </p>
        <p>
          Framework references (NIST CSF 2.0, ISO/IEC 27001, IEC 62443, NIS2,
          CRA, etc.) are used only for module classification and metadata — not
          as compliance conclusions or certifications.
        </p>
        <p>{t(locale, "app.footerDisclaimer")}</p>
      </div>
    </div>
  );
}
