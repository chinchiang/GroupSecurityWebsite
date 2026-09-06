import type { Locale } from "@/config/site";

// All timestamps are rendered in the portal's home time zone regardless of
// where the server runs (CI containers default to UTC).
export const DISPLAY_TIME_ZONE = "Asia/Taipei";

/**
 * Value for an `<input type="datetime-local">` representing "now" in the
 * browser's local time (toISOString() alone would yield UTC).
 */
export function localDateTimeInputValue(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

/** Convert a datetime-local string (interpreted in the caller's zone) to ISO 8601 UTC. */
export function toIsoTimestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export function formatDateTime(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh-TW" ? "zh-TW" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(date);
}

export function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh-TW" ? "zh-TW" : "en-US", {
    dateStyle: "medium",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(date);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "zh-TW" ? "zh-TW" : "en-US").format(
    value,
  );
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "zh-TW" ? "zh-TW" : "en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSeverity(level: string, locale: Locale): string {
  const map: Record<string, { "zh-TW": string; en: string }> = {
    critical: { "zh-TW": "嚴重", en: "Critical" },
    high: { "zh-TW": "高", en: "High" },
    medium: { "zh-TW": "中", en: "Medium" },
    low: { "zh-TW": "低", en: "Low" },
    informational: { "zh-TW": "資訊", en: "Informational" },
  };
  return map[level]?.[locale] ?? level;
}
