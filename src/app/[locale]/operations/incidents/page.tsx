import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listIncidents } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { DataTable } from "@/components/tables/data-table";
import { localizedHref } from "@/config/navigation";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let rows;
  try {
    rows = await listIncidents(session.user);
  } catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.incidents")} />

      <DataTable
        caption="Incidents"
        emptyMessage={t(locale, "app.empty")}
        columns={[
          { id: "title", header: "Title" },
          { id: "sev", header: "Severity" },
          { id: "type", header: "Type" },
          { id: "status", header: "Status" },
          { id: "class", header: "Classification" }
        ]}
        rows={rows.map((r) => ({
          id: r.id,
          detailHref: localizedHref(locale, `/operations/incidents/` + r.id),
          cells: {
            title: r.title,
            sev: r.severity,
            type: r.incidentType,
            status: r.status,
            class: r.classification,
          },
        }))}
      />
    </div>
  );
}
