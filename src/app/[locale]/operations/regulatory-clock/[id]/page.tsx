import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getClock } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { DemoBadge } from "@/components/status/badges";
import { formatDateTime } from "@/lib/formatting";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getClock(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={item.regulation} description={t(locale, "clock.demoNotice")} actions={<DemoBadge label={t(locale, "status.demo")} />} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Related incident</dt><dd>{item.relatedIncidentId}</dd></div>
        <div><dt className="font-semibold">Jurisdiction</dt><dd>{item.jurisdiction}</dd></div>
        <div><dt className="font-semibold">Trigger status</dt><dd>{item.triggerStatus}</dd></div>
        <div><dt className="font-semibold">Submission status</dt><dd>{item.submissionStatus}</dd></div>
        <div><dt className="font-semibold">Awareness</dt><dd>{formatDateTime(item.awarenessTimestamp, locale)}</dd></div>
        <div><dt className="font-semibold">Early warning due</dt><dd>{formatDateTime(item.earlyWarningDue, locale)}</dd></div>
        <div><dt className="font-semibold">Notification due</dt><dd>{formatDateTime(item.notificationDue, locale)}</dd></div>
        <div><dt className="font-semibold">Final report due</dt><dd>{formatDateTime(item.finalReportDue, locale)}</dd></div>
        <div><dt className="font-semibold">Owner</dt><dd>{item.responsibleOwner}</dd></div>
        <div><dt className="font-semibold">Legal reviewer</dt><dd>{item.legalReviewer}</dd></div>
        <div className="md:col-span-2"><dt className="font-semibold">Evidence snapshot</dt><dd>{item.evidenceSnapshot}</dd></div>
      </dl>
    </div>
  );
}
