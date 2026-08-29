import { notFound } from "next/navigation";
import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/authorization";
import { Sidebar } from "@/components/navigation/sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { AppFooter } from "@/components/layout/footer";
import { formatDateTime } from "@/lib/formatting";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  let session;
  try {
    session = await requireSession();
  } catch {
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="text-2xl font-semibold">{t(locale, "configError.title")}</h1>
        <p className="mt-3 text-slate-600">{t(locale, "configError.body")}</p>
      </div>
    );
  }

  const canAdmin = can(session.user, "administer", { type: "admin" }) ||
    can(session.user, "view", { type: "admin" });

  const scopeSummary = [
    session.user.scope.legalEntities.slice(0, 2).join(", "),
    session.user.scope.plants.slice(0, 2).join(", ") || "All plants (demo)",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        {t(locale, "app.skipToContent")}
      </a>
      <Sidebar locale={locale} canAdmin={canAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          locale={locale}
          userName={session.user.displayName}
          role={session.user.role}
          scopeSummary={scopeSummary}
          refreshedAt={formatDateTime(session.authenticatedAt, locale)}
        />
        <main id="main-content" className="flex-1 px-4 py-6 lg:px-6">
          {children}
        </main>
        <AppFooter locale={locale} />
      </div>
    </div>
  );
}
