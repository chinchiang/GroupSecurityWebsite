import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDashboard } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import {
  AccessDeniedState,
  DemoBanner,
  ErrorState,
  PageHeader,
} from "@/components/layout/page-states";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SeverityBadge } from "@/components/status/badges";
import { localizedHref } from "@/config/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/formatting";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();

  let data;
  try {
    data = await getDashboard(session.user);
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return <AccessDeniedState locale={locale} />;
    }
    return <ErrorState message={t(locale, "app.error")} />;
  }

  const isExecutive = session.user.role === "executive";
  const isOt = session.user.role === "ot_engineer" || session.user.role === "plant_manager";
  const isEmployee = session.user.role === "employee";

  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader
        title={t(locale, "dashboard.title")}
        description={`${session.user.displayName} · ${session.user.role}`}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardCard locale={locale} title={t(locale, "dashboard.myTasks")}>
          <ul className="space-y-2">
            {data.tasks.map((task) => (
              <li key={task.id} className="rounded border border-slate-100 p-2">
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-slate-500">
                  Due {formatDate(task.dueDate, locale)} · {task.status}
                </p>
              </li>
            ))}
            {data.tasks.length === 0 ? <li>{t(locale, "app.empty")}</li> : null}
          </ul>
        </DashboardCard>

        {!isEmployee ? (
          <DashboardCard
            locale={locale}
            title={t(locale, "dashboard.incidentsClock")}
            metric={data.metrics.find((m) => m.id === "metric-open-incidents")}
          >
            <ul className="space-y-2">
              {data.incidents.map((inc) => (
                <li key={inc.id} className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={localizedHref(locale, `/operations/incidents/${inc.id}`)}
                      className="font-medium text-cyan-800 underline"
                    >
                      {inc.title}
                    </Link>
                    <p className="text-xs text-slate-500">{inc.status}</p>
                  </div>
                  <SeverityBadge level={inc.severity} locale={locale} />
                </li>
              ))}
            </ul>
          </DashboardCard>
        ) : null}

        {!isEmployee ? (
          <DashboardCard locale={locale} title={t(locale, "dashboard.topRisks")}>
            <ul className="space-y-2">
              {data.topRisks.map((risk) => (
                <li key={risk.id}>
                  <Link
                    href={localizedHref(locale, `/governance/risks/${risk.id}`)}
                    className="font-medium text-cyan-800 underline"
                  >
                    {risk.title}
                  </Link>
                  <div className="mt-1">
                    <SeverityBadge level={risk.riskLevel} locale={locale} />
                  </div>
                </li>
              ))}
            </ul>
          </DashboardCard>
        ) : null}

        {!isEmployee ? (
          <DashboardCard
            locale={locale}
            title={t(locale, "dashboard.criticalExposure")}
            metric={data.metrics.find((m) => m.id === "metric-critical-vulns")}
          >
            <ul className="space-y-2">
              {data.criticalVulns.map((v) => (
                <li key={v.id}>
                  <Link
                    href={localizedHref(
                      locale,
                      `/protection/vulnerabilities/${v.id}`,
                    )}
                    className="font-medium text-cyan-800 underline"
                  >
                    {v.title}
                  </Link>
                  {isExecutive ? (
                    <p className="text-xs text-slate-500">
                      Technical detail hidden for executive view
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </DashboardCard>
        ) : null}

        {(isOt || !isEmployee) && (
          <DashboardCard locale={locale} title={t(locale, "dashboard.plantsOt")}>
            <ul className="space-y-2">
              {data.plants.map((p) => (
                <li key={p.id}>
                  <Link
                    href={localizedHref(locale, `/manufacturing/plants/${p.id}`)}
                    className="font-medium text-cyan-800 underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    OT risk {p.otRiskLevel} · unsupported {p.unsupportedOtCount}
                  </p>
                </li>
              ))}
              {data.plants.length === 0 ? (
                <li className="text-xs text-slate-500">
                  No plants in authorized scope
                </li>
              ) : null}
            </ul>
          </DashboardCard>
        )}

        {!isEmployee ? (
          <DashboardCard
            locale={locale}
            title={t(locale, "dashboard.productSupply")}
          >
            <ul className="space-y-2">
              {data.products.map((p) => (
                <li key={p.id}>
                  {p.productFamily} · SBOM {p.sbomCoveragePercent}% · PSIRT open{" "}
                  {p.psirtOpenCount}
                </li>
              ))}
              {data.suppliers.map((s) => (
                <li key={s.id}>
                  <Link
                    href={localizedHref(locale, `/supply-chain/${s.id}`)}
                    className="text-cyan-800 underline"
                  >
                    {s.name}
                  </Link>{" "}
                  · tier {s.tier}
                </li>
              ))}
            </ul>
          </DashboardCard>
        ) : null}

        <DashboardCard
          locale={locale}
          title={t(locale, "dashboard.servicesTraining")}
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href={localizedHref(locale, "/services/new")}
              className="text-cyan-800 underline"
            >
              New service request
            </Link>
            <Link
              href={localizedHref(locale, "/training")}
              className="text-cyan-800 underline"
            >
              Training
            </Link>
            <Link
              href={localizedHref(locale, "/knowledge")}
              className="text-cyan-800 underline"
            >
              Knowledge
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
