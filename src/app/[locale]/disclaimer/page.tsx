import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title={t(locale, "nav.disclaimer")} />
      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <p>{t(locale, "app.footerDisclaimer")}</p>
        <p>{t(locale, "app.demoBanner")}</p>
        <p>
          This MVP uses Mock Auth and Mock Data only. No production deployment,
          real notifications, or enterprise system connections are performed.
        </p>
      </div>
    </div>
  );
}
