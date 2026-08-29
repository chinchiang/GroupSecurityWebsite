import type { Locale } from "@/config/site";

export function formatDateTime(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh-TW" ? "zh-TW" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "zh-TW" ? "zh-TW" : "en-US", {
    dateStyle: "medium",
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
