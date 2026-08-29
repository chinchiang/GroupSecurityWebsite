import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getPlant } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { SeverityBadge, DemoBadge } from "@/components/status/badges";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getPlant(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={item.name} description="No real OT topology or IP addresses are shown." actions={<DemoBadge label={t(locale, "status.demo")} />} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Code</dt><dd>{item.code}</dd></div>
        <div><dt className="font-semibold">OT risk</dt><dd><SeverityBadge level={item.otRiskLevel} locale={locale} /></dd></div>
        <div><dt className="font-semibold">Unsupported OT count</dt><dd>{item.unsupportedOtCount}</dd></div>
        <div><dt className="font-semibold">Remote access vendors</dt><dd>{item.remoteAccessVendors}</dd></div>
        <div><dt className="font-semibold">Recovery readiness</dt><dd>{item.recoveryReadiness}</dd></div>
        <div><dt className="font-semibold">Site</dt><dd>{item.site}</dd></div>
      </dl>
    </div>
  );
}
