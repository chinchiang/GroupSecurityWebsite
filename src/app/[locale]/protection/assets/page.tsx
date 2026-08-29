import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listAssets } from "@/services/catalog";
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
    rows = await listAssets(session.user);
  } catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.assets")} />

      <DataTable
        caption="Assets"
        emptyMessage={t(locale, "app.empty")}
        columns={[
          { id: "name", header: "Name" },
          { id: "type", header: "Type" },
          { id: "env", header: "Environment" },
          { id: "crit", header: "Criticality" },
          { id: "plant", header: "Plant" }
        ]}
        rows={rows.map((r) => ({
          id: r.id,
          detailHref: localizedHref(locale, `/protection/assets/` + r.id),
          cells: {
            name: r.name,
            type: r.assetType,
            env: r.environment,
            crit: r.criticality,
            plant: r.plant ?? "—",
          },
        }))}
      />
    </div>
  );
}
