import type { Locale } from "@/config/site";
import { t } from "@/lib/i18n/dictionaries";

export function DemoBanner({ locale }: { locale: Locale }) {
  return (
    <div
      className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950"
      role="note"
    >
      {t(locale, "app.demoBanner")}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-600"
      role="status"
    >
      {message}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="rounded-md border border-red-300 bg-red-50 px-4 py-6 text-sm text-red-900"
      role="alert"
    >
      {message}
    </div>
  );
}

export function AccessDeniedState({
  locale,
}: {
  locale: Locale;
}) {
  return (
    <div className="rounded-md border border-slate-300 bg-white p-8" role="alert">
      <h1 className="text-xl font-semibold text-slate-900">
        {t(locale, "app.accessDenied")}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {t(locale, "app.accessDeniedBody")}
      </p>
    </div>
  );
}

export function LoadingState({ locale }: { locale: Locale }) {
  return (
    <div className="animate-pulse rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-500">
      {t(locale, "app.loading")}
    </div>
  );
}
