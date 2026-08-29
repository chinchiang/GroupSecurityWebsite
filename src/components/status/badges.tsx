import type { Locale } from "@/config/site";
import { formatSeverity } from "@/lib/formatting";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-900 border-red-300",
  high: "bg-orange-100 text-orange-900 border-orange-300",
  medium: "bg-amber-100 text-amber-950 border-amber-300",
  low: "bg-blue-100 text-blue-900 border-blue-300",
  informational: "bg-slate-100 text-slate-800 border-slate-300",
};

export function SeverityBadge({
  level,
  locale,
}: {
  level: string;
  locale: Locale;
}) {
  const Icon =
    level === "critical" || level === "high"
      ? ShieldAlert
      : level === "medium"
        ? AlertTriangle
        : Info;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold",
        severityStyles[level] ?? severityStyles.informational,
      )}
      role="status"
      aria-label={`Severity ${formatSeverity(level, locale)}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>{formatSeverity(level, locale)}</span>
      <span className="sr-only">({level})</span>
    </span>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-800"
      role="status"
    >
      <span
        className="inline-block h-2 w-2 rounded-sm bg-slate-600"
        aria-hidden
      />
      {label}
      <span className="sr-only">status:{status}</span>
    </span>
  );
}

export function ClassificationBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded border border-violet-300 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-900">
      {value}
    </span>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded border border-cyan-400 bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-900">
      {label}
    </span>
  );
}
