import Link from "next/link";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { localizedHref } from "@/config/navigation";
import { t } from "@/lib/i18n/dictionaries";

export function AppFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-6 text-xs text-slate-600 lg:px-6">
      <p>{t(locale, "app.footerDisclaimer")}</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <Link
          href={localizedHref(locale, "/about")}
          className="text-cyan-800 underline"
        >
          {t(locale, "nav.about")}
        </Link>
        <Link
          href={localizedHref(locale, "/disclaimer")}
          className="text-cyan-800 underline"
        >
          {t(locale, "nav.disclaimer")}
        </Link>
        <span>{siteConfig.brandName}</span>
      </div>
    </footer>
  );
}
