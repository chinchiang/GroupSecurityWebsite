import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listClocks } from "@/services/catalog";
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
    rows = await listClocks(session.user);
  } catch (e) {
    if (e instanceof AuthorizationError) return <AccessDeniedState locale={locale} />;
    return <ErrorState message={t(locale, "app.error")} />;
  }
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.regulatoryClock")} description={t(locale, "clock.demoNotice")} />
      <div className="mb-4 rounded border border-cyan-300 bg-cyan-50 p-3 text-sm text-cyan-950" role="note">{t(locale, "clock.demoNotice")}</div>
      <DataTable
        caption="Regulatory clocks"
        emptyMessage={t(locale, "app.empty")}
        columns={[
          { id: "reg", header: "Regulation" },
          { id: "j", header: "Jurisdiction" },
          { id: "due", header: "Notification due" },
          { id: "sub", header: "Submission" }
        ]}
        rows={rows.map((r) => ({
          id: r.id,
          detailHref: localizedHref(locale, `/operations/regulatory-clock/` + r.id),
          cells: {
            reg: r.regulation,
            j: r.jurisdiction,
            due: r.notificationDue,
            sub: r.submissionStatus,
          },
        }))}
      />
    </div>
  );
}
