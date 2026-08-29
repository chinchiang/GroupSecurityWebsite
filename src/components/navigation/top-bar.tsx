"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import type { Locale } from "@/config/site";
import type { UserRole } from "@/config/roles";
import { USER_ROLES, ROLE_LABELS } from "@/config/roles";
import { localizedHref } from "@/config/navigation";
import { features } from "@/config/features";
import { t } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { LanguageSwitcher } from "@/components/navigation/sidebar";
import { useState, useTransition } from "react";

export function TopBar({
  locale,
  userName,
  role,
  scopeSummary,
  refreshedAt,
}: {
  locale: Locale;
  userName: string;
  role: UserRole;
  scopeSummary: string;
  refreshedAt: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const base = localizedHref(locale, "/search");
    router.push(`${base}?q=${encodeURIComponent(query)}`);
  }

  function onRoleChange(next: UserRole) {
    startTransition(async () => {
      await fetch("/api/demo-role", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      router.refresh();
    });
  }

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .map((part, idx, arr) => {
      const href = `/${locale}/` + arr.slice(0, idx + 1).join("/");
      return { label: part, href };
    });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <form onSubmit={onSearch} className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              aria-label={t(locale, "app.searchPlaceholder")}
              placeholder={t(locale, "app.searchPlaceholder")}
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <LanguageSwitcher locale={locale} />
          <Button asChild size="sm">
            <Link href={localizedHref(locale, "/my-security/report-incident")}>
              {t(locale, "app.reportIncident")}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={localizedHref(locale, "/my-security/report-phishing")}>
              {t(locale, "app.reportPhishing")}
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" aria-label={t(locale, "app.notifications")}>
            <Link href={localizedHref(locale, "/my-security")}>
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2 text-xs text-slate-600 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link
                  href={localizedHref(locale, "/")}
                  className="text-cyan-800 underline"
                >
                  {t(locale, "nav.home")}
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1">
                  <span aria-hidden>/</span>
                  <Link href={c.href} className="hover:underline">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              {t(locale, "app.dataRefresh")}: {refreshedAt}
            </span>
            <span>
              {t(locale, "app.emergency")}:{" "}
              <Link
                href={localizedHref(locale, "/my-security/emergency")}
                className="text-cyan-800 underline"
              >
                SOC Demo
              </Link>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="font-semibold text-slate-900">
            {t(locale, "app.demoIdentity")}
          </span>
          <span>{userName}</span>
          <span className="text-slate-500">·</span>
          <span>{ROLE_LABELS[role][locale === "zh-TW" ? "zhTW" : "en"]}</span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-600">{scopeSummary}</span>
          {features.roleSwitcher ? (
            <label className="ml-auto flex items-center gap-2 text-xs">
              <span>Role</span>
              <select
                className="h-8 rounded border border-slate-300 bg-white px-2"
                value={role}
                disabled={pending}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                aria-label="Demo role switcher"
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r].en}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>
    </header>
  );
}
