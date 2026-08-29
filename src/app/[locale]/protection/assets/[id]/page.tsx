import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getAsset } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { SeverityBadge, ClassificationBadge, DemoBadge } from "@/components/status/badges";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getAsset(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={item.name} actions={<DemoBadge label={t(locale, "status.demo")} />} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Type</dt><dd>{item.assetType}</dd></div>
        <div><dt className="font-semibold">Environment</dt><dd>{item.environment}</dd></div>
        <div><dt className="font-semibold">Criticality</dt><dd><SeverityBadge level={item.criticality} locale={locale} /></dd></div>
        <div><dt className="font-semibold">Classification</dt><dd><ClassificationBadge value={item.classification} /></dd></div>
        <div><dt className="font-semibold">Owner</dt><dd>{item.owner}</dd></div>
        <div><dt className="font-semibold">Plant</dt><dd>{item.plant ?? "—"}</dd></div>
      </dl>
    </div>
  );
}
