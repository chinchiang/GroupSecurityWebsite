import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { localizedHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { DemoBanner, PageHeader } from "@/components/layout/page-states";
import { Button } from "@/components/ui/button";

export default async function MySecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireSession();

  const links = [
    { href: "/my-security/report-incident", label: t(locale, "nav.reportIncident") },
    { href: "/my-security/report-phishing", label: t(locale, "nav.reportPhishing") },
    { href: "/my-security/lost-device", label: t(locale, "nav.lostDevice") },
    { href: "/my-security/emergency", label: t(locale, "nav.emergency") },
    { href: "/services/new", label: "Service request" },
    { href: "/training", label: t(locale, "nav.training") },
  ];

  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader
        title={t(locale, "nav.mySecurity")}
        description={t(locale, "nav.myTasks")}
        actions={
          <>
            <Button asChild>
              <Link href={localizedHref(locale, "/my-security/report-incident")}>
                {t(locale, "app.reportIncident")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={localizedHref(locale, "/my-security/report-phishing")}>
                {t(locale, "app.reportPhishing")}
              </Link>
            </Button>
          </>
        }
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={localizedHref(locale, l.href)}
              className="block rounded-md border border-slate-200 bg-white p-4 text-sm font-medium text-cyan-900 hover:border-cyan-400"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-6 rounded-md border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">{t(locale, "nav.emergency")}</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {siteConfig.emergencyContacts.map((c) => (
            <li key={c.id}>
              {c.label}: {c.value}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
