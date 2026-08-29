import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getServiceRequest } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { DemoBadge } from "@/components/status/badges";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getServiceRequest(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={item.title} actions={<DemoBadge label={t(locale, "status.demo")} />} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Type</dt><dd>{item.serviceType}</dd></div>
        <div><dt className="font-semibold">Status</dt><dd>{item.status}</dd></div>
        <div><dt className="font-semibold">Approver</dt><dd>{item.approver}</dd></div>
        <div><dt className="font-semibold">Required by</dt><dd>{item.requiredCompletionDate}</dd></div>
        <div className="md:col-span-2"><dt className="font-semibold">Justification</dt><dd>{item.justification}</dd></div>
      </dl>
    </div>
  );
}
