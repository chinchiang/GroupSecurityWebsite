import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listServiceRequests } from "@/services/catalog";
import { AuthorizationError } from "@/lib/authorization/guards";
import { AccessDeniedState, DemoBanner, ErrorState, PageHeader } from "@/components/layout/page-states";
import { DataTable } from "@/components/tables/data-table";
import { localizedHref } from "@/config/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  let rows;
  try {
    rows = await listServiceRequests(session.user);
  } catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.services")} actions={<Button asChild><Link href={localizedHref(locale, "/services/new")}>New request</Link></Button>} />

      <DataTable
        caption="Service requests"
        emptyMessage={t(locale, "app.empty")}
        columns={[
          { id: "title", header: "Title" },
          { id: "type", header: "Type" },
          { id: "status", header: "Status" },
          { id: "due", header: "Required by" }
        ]}
        rows={rows.map((r) => ({
          id: r.id,
          detailHref: localizedHref(locale, `/services/` + r.id),
          cells: {
            title: r.title,
            type: r.serviceType,
            status: r.status,
            due: r.requiredCompletionDate,
          },
        }))}
      />
    </div>
  );
}
