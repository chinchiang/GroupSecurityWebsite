import type { Locale } from "@/config/site";

/** Hours remaining until due; negative if overdue. Demo helper only. */
export function hoursUntil(dueIso: string, nowIso = new Date().toISOString()): number {
  const due = new Date(dueIso).getTime();
  const now = new Date(nowIso).getTime();
  return Math.round((due - now) / (1000 * 60 * 60));
}

export function clockStatusLabel(
  dueIso: string,
  locale: Locale,
  nowIso?: string,
): string {
  const hours = hoursUntil(dueIso, nowIso);
  if (hours < 0) {
    return locale === "zh-TW" ? "已逾期（Demo）" : "Overdue (Demo)";
  }
  if (hours < 24) {
    return locale === "zh-TW" ? "24 小時內到期（Demo）" : "Due within 24h (Demo)";
  }
  return locale === "zh-TW" ? "進行中（Demo）" : "In progress (Demo)";
}

export function calculateMetricPercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}
