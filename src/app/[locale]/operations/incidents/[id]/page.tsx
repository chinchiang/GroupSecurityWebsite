import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getIncident } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { SeverityBadge, ClassificationBadge, DemoBadge } from "@/components/status/badges";
import { formatDateTime } from "@/lib/formatting";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getIncident(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={item.title} description={item.summary} actions={<DemoBadge label={t(locale, "status.demo")} />} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Severity</dt><dd><SeverityBadge level={item.severity} locale={locale} /></dd></div>
        <div><dt className="font-semibold">Classification</dt><dd><ClassificationBadge value={item.classification} /></dd></div>
        <div><dt className="font-semibold">Type</dt><dd>{item.incidentType}</dd></div>
        <div><dt className="font-semibold">Detected</dt><dd>{formatDateTime(item.detectedAt, locale)}</dd></div>
        <div><dt className="font-semibold">Owner</dt><dd>{item.owner}</dd></div>
        <div><dt className="font-semibold">Safety impact</dt><dd>{String(item.safetyImpact)}</dd></div>
        <div><dt className="font-semibold">IOC summary</dt><dd>{item.iocSummary ?? "—"}</dd></div>
        <div><dt className="font-semibold">Host hint</dt><dd>{item.internalHostHint ?? "—"}</dd></div>
      </dl>
    </div>
  );
}
