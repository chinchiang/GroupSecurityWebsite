import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listAuditEvents } from "@/services/catalog";
import { can } from "@/lib/authorization";
import {
  AccessDeniedState,
  DemoBanner,
  PageHeader,
} from "@/components/layout/page-states";
import { DataTable } from "@/components/tables/data-table";
import { integrationCatalog } from "@/adapters/integrations/catalog";
import { formatDateTime } from "@/lib/formatting";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();

  if (!can(session.user, "view", { type: "admin" })) {
    return <AccessDeniedState locale={locale} />;
  }

  let audits: Awaited<ReturnType<typeof listAuditEvents>> = [];
  if (can(session.user, "view", { type: "audit_trail" })) {
    audits = await listAuditEvents(session.user);
  }

  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "admin.title")} />
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          {t(locale, "admin.auditTrail")}
        </h2>
        <DataTable
          caption="Audit events"
          emptyMessage={t(locale, "app.empty")}
          columns={[
            { id: "ts", header: "Time" },
            { id: "action", header: "Action" },
            { id: "actor", header: "Actor" },
            { id: "resource", header: "Resource" },
            { id: "outcome", header: "Outcome" },
          ]}
          rows={audits.map((r) => ({
            id: r.id,
            cells: {
              ts: formatDateTime(r.timestamp, locale),
              action: r.action,
              actor: `${r.actorId} (${r.actorRole})`,
              resource: `${r.resourceType}${r.resourceId ? `:${r.resourceId}` : ""}`,
              outcome: r.outcome,
            },
          }))}
        />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Integration adapters (stub)</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {integrationCatalog.map((a) => (
            <li
              key={a.id}
              className="rounded border border-slate-200 bg-white p-3 text-sm"
            >
              <p className="font-semibold">
                {a.name} · {a.status}
              </p>
              <p className="text-slate-600">{a.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
