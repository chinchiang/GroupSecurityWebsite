import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getKnowledge } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { StatusBadge, DemoBadge, ClassificationBadge } from "@/components/status/badges";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try { item = await getKnowledge(session.user, id); }
  catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();
  const m = item.metadata;
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={m.title} description={item.summary} actions={<><DemoBadge label={t(locale, "status.demo")} /><StatusBadge status={m.status} label={t(locale, `status.${m.status}`)} /></>} />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div><dt className="font-semibold">Owner</dt><dd>{m.owner}</dd></div>
        <div><dt className="font-semibold">Approver</dt><dd>{m.approver ?? "—"}</dd></div>
        <div><dt className="font-semibold">Version</dt><dd>{m.version}</dd></div>
        <div><dt className="font-semibold">Classification</dt><dd><ClassificationBadge value={m.classification} /></dd></div>
        <div><dt className="font-semibold">Last verified</dt><dd>{m.lastVerifiedDate ?? "—"}</dd></div>
        <div><dt className="font-semibold">Framework refs</dt><dd>{m.frameworkReferences.join(", ")}</dd></div>
        <div className="md:col-span-2"><dt className="font-semibold">Body</dt><dd>{item.bodyPlaceholder}</dd></div>
      </dl>
    </div>
  );
}
