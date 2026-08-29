import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";
import { PhishingReportForm } from "@/components/forms/phishing-report-form";

export default async function ReportPhishingPage({
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
      <PageHeader title={t(locale, "nav.reportPhishing")} />
      <PhishingReportForm locale={locale} />
    </div>
  );
}
