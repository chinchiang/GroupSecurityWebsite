import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";

export default async function Page({
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
      <PageHeader title={t(locale, "nav.data")} description="Content pending / 內容待補" />
      <p className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        {t(locale, "content.pending")}
      </p>
    </div>
  );
}
