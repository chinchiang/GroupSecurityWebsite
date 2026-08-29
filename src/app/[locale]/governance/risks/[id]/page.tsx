import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getRisk } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import {
  AccessDeniedState,
  DemoBanner,
  ErrorState,
  PageHeader,
} from "@/components/layout/page-states";
import { SeverityBadge, ClassificationBadge, DemoBadge } from "@/components/status/badges";
import { formatDateTime } from "@/lib/formatting";

export default async function RiskDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let item;
  try {
    item = await getRisk(session.user, id);
  } catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  if (!item) notFound();

  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader
        title={item.title}
        description={item.summary}
        actions={<DemoBadge label={t(locale, "status.demo")} />}
      />
      <dl className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm md:grid-cols-2">
        <div>
          <dt className="font-semibold">Level</dt>
          <dd>
            <SeverityBadge level={item.riskLevel} locale={locale} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Classification</dt>
          <dd>
            <ClassificationBadge value={item.classification} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Owner</dt>
          <dd>{item.owner}</dd>
        </div>
        <div>
          <dt className="font-semibold">Status</dt>
          <dd>{item.status}</dd>
        </div>
        <div>
          <dt className="font-semibold">Residual score</dt>
          <dd>{item.residualScore}</dd>
        </div>
        <div>
          <dt className="font-semibold">Updated</dt>
          <dd>{formatDateTime(item.updatedAt, locale)}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="font-semibold">Framework references</dt>
          <dd>{item.frameworkReferences.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
}
