import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { computeMedianWeight } from "@/lib/utils/baseline";
import type { DailyRecord } from "@/types/diary";

function record(date: string, weightGrams: number): DailyRecord {
  return { date, weightGrams };
}

describe("computeMedianWeight", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-04T12:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for no weight records", () => {
    expect(computeMedianWeight([])).toBeNull();
  });

  it("returns median for odd number of weights", () => {
    const records = [record("2026-07-01", 80), record("2026-07-02", 82), record("2026-07-03", 84)];
    expect(computeMedianWeight(records)).toBe(82);
  });

  it("returns median for even number of weights", () => {
    const records = [record("2026-07-01", 80), record("2026-07-02", 82), record("2026-07-03", 84), record("2026-07-04", 86)];
    expect(computeMedianWeight(records)).toBe(83);
  });

  it("excludes records older than the day window", () => {
    const records = [
      record("2026-05-01", 50),
      record("2026-07-01", 80),
      record("2026-07-02", 82),
      record("2026-07-03", 84),
    ];
    expect(computeMedianWeight(records, 30)).toBe(82);
  });

  it("respects custom day window", () => {
    const records = [
      record("2026-07-01", 70),
      record("2026-07-02", 72),
      record("2026-07-03", 74),
      record("2026-07-04", 76),
    ];
    expect(computeMedianWeight(records, 3)).toBe(73);
  });
});
