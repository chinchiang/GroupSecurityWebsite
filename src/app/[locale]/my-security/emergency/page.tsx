import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";

export default async function EmergencyPage({
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
      <PageHeader title={t(locale, "nav.emergency")} />
      <ul className="space-y-3">
        {siteConfig.emergencyContacts.map((c) => (
          <li
            key={c.id}
            className="rounded-md border border-slate-200 bg-white p-4 text-sm"
          >
            <p className="font-semibold">{c.label}</p>
            <p>{c.value}</p>
            <p className="text-xs text-slate-500">{c.channel}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
