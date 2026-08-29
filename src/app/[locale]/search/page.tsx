import type { Locale } from "@/config/site";
import { isLocale, t } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { globalSearch } from "@/services/catalog";
import {
  DemoBanner,
  EmptyState,
  PageHeader,
} from "@/components/layout/page-states";
import { ClassificationBadge } from "@/components/status/badges";
import { localizedHref } from "@/config/navigation";
import { formatDateTime } from "@/lib/formatting";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { q = "" } = await searchParams;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const session = await requireSession();
  const results = await globalSearch(session.user, q);

  return (
    <div>
      <DemoBanner locale={locale} />
      <PageHeader
        title={t(locale, "search.results")}
        description={`q=${q || "(empty)"}`}
      />
      {results.length === 0 ? (
        <EmptyState message={t(locale, "search.noResults")} />
      ) : (
        <ul className="space-y-3">
          {results.map((r) => (
            <li
              key={`${r.type}-${r.id}`}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold uppercase">
                  {r.type}
                </span>
                <ClassificationBadge value={r.classification} />
                <span>{formatDateTime(r.updatedAt, locale)}</span>
              </div>
              <Link
                href={localizedHref(locale, r.href)}
                className="mt-1 block text-base font-semibold text-cyan-900 underline"
              >
                {r.title}
              </Link>
              <p className="mt-1 text-sm text-slate-600">{r.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
