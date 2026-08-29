import type { Locale } from "@/config/site";
import type { MetricMetadata } from "@/domain/models";
import { localizedHref } from "@/config/navigation";
import { formatNumber, formatPercent } from "@/lib/formatting";
import { calculateMetricPercent } from "@/lib/formatting/metrics";
import Link from "next/link";
import { DemoBadge } from "@/components/status/badges";

export function DashboardCard({
  locale,
  title,
  metric,
  children,
}: {
  locale: Locale;
  title: string;
  metric?: MetricMetadata;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <DemoBadge label={locale === "zh-TW" ? "示範資料" : "Demo"} />
      </div>
      {metric ? (
        <dl className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <dt className="font-semibold">Definition</dt>
            <dd>{metric.definition}</dd>
          </div>
          <div>
            <dt className="font-semibold">Scope</dt>
            <dd>{metric.scope}</dd>
          </div>
          <div>
            <dt className="font-semibold">Source</dt>
            <dd>{metric.dataSource}</dd>
          </div>
          <div>
            <dt className="font-semibold">Owner</dt>
            <dd>{metric.dataOwner}</dd>
          </div>
          <div>
            <dt className="font-semibold">Value</dt>
            <dd>
              {formatNumber(metric.currentValue, locale)} / target{" "}
              {formatNumber(metric.target, locale)} (
              {formatPercent(
                calculateMetricPercent(metric.numerator, metric.denominator || 1),
                locale,
              )}
              )
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Quality</dt>
            <dd>
              {metric.dataQualityStatus} · trend {metric.trend}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-semibold">Exclusions</dt>
            <dd>{metric.knownExclusions.join("; ") || "None"}</dd>
          </div>
          <div className="col-span-2">
            <Link
              href={localizedHref(locale, metric.drillDownHref)}
              className="font-medium text-cyan-800 underline"
            >
              Drill down
            </Link>
          </div>
        </dl>
      ) : null}
      <div className="text-sm text-slate-800">{children}</div>
    </section>
  );
}
