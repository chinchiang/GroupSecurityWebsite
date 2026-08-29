import type { Locale } from "@/config/site";
import { isLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { AccessDeniedState, DemoBanner } from "@/components/layout/page-states";

export default async function AccessDeniedPage({
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
      <AccessDeniedState locale={locale} />
    </div>
  );
}
