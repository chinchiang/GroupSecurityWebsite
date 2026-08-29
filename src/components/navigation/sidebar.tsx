"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Lock,
  Menu,
  Radar,
  Settings,
  Shield,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/config/site";
import { mainNavigation, localizedHref } from "@/config/navigation";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

const iconMap = {
  Shield,
  Landmark,
  Radar,
  Lock,
  Factory,
  Truck,
  HeartPulse,
  GraduationCap,
  Briefcase,
  BookOpen,
  Settings,
} as const;

export function Sidebar({
  locale,
  canAdmin,
}: {
  locale: Locale;
  canAdmin: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = mainNavigation.filter(
    (item) => item.id !== "admin" || canAdmin,
  );

  const nav = (
    <nav aria-label="Primary" className="space-y-1 px-3 py-4">
      {items.map((item) => {
        const Icon =
          item.icon && item.icon in iconMap
            ? iconMap[item.icon as keyof typeof iconMap]
            : Shield;
        const href = localizedHref(locale, item.href);
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <div key={item.id}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                active && "bg-slate-800 text-white",
              )}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {t(locale, item.labelKey)}
            </Link>
            {item.children && active ? (
              <ul className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                {item.children.map((child) => {
                  const childHref = localizedHref(locale, child.href);
                  const childActive = pathname === childHref;
                  return (
                    <li key={child.id}>
                      <Link
                        href={childHref}
                        className={cn(
                          "block rounded px-2 py-1 text-xs text-slate-300 hover:text-white",
                          childActive && "text-cyan-300",
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {t(locale, child.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-white">
          {t(locale, "app.brand")}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-30 bg-slate-950/95 lg:hidden">{nav}</div>
      ) : null}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="border-b border-slate-800 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              Cybersecurity
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white">
              {t(locale, "app.brand")}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">{nav}</div>
        </div>
      </aside>
    </>
  );
}

export function LanguageSwitcher({
  locale,
}: {
  locale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    const parts = pathname.split("/");
    if (parts.length > 1) {
      parts[1] = next;
      router.push(parts.join("/") || `/${next}`);
    } else {
      router.push(`/${next}`);
    }
    document.cookie = `locale_pref=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={t(locale, "app.language")}>
      <Button
        type="button"
        size="sm"
        variant={locale === "zh-TW" ? "default" : "outline"}
        onClick={() => switchTo("zh-TW")}
      >
        繁中
      </Button>
      <Button
        type="button"
        size="sm"
        variant={locale === "en" ? "default" : "outline"}
        onClick={() => switchTo("en")}
      >
        EN
      </Button>
    </div>
  );
}
