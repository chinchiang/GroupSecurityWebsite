import type { Locale } from "@/config/site";
import { isLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";
import { ServiceRequestForm } from "@/components/forms/service-request-form";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader title="Security Service Request" />
      <ServiceRequestForm locale={locale} />
    </div>
  );
}
