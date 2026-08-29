import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";
import { IncidentReportForm } from "@/components/forms/incident-report-form";

export default async function ReportIncidentPage({
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
      <PageHeader title={t(locale, "nav.reportIncident")} />
      <IncidentReportForm locale={locale} />
    </div>
  );
}
