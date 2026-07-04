import type { DailyRecord } from "@/types/diary";
import { getDaysAgoKey } from "@/lib/utils/date";

function roundOneDecimal(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeMedianWeight(records: DailyRecord[], days = 30): number | null {
  const fromDate = getDaysAgoKey(days);
  const weights = records
    .filter(r => r.weightGrams !== undefined && r.date >= fromDate)
    .map(r => r.weightGrams as number)
    .sort((a, b) => a - b);

  if (weights.length === 0) {
    return null;
  }

  const mid = Math.floor(weights.length / 2);
  if (weights.length % 2 === 1) {
    return weights[mid];
  }

  return roundOneDecimal((weights[mid - 1] + weights[mid]) / 2);
}
