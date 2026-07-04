import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { formatDateKey, getTodayKey, addDays } from "@/lib/utils/date";

describe("date utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-04T12:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("getTodayKey returns JST date key", () => {
    expect(getTodayKey()).toBe("2026-07-04");
  });

  it("formatDateKey formats in JST", () => {
    expect(formatDateKey(new Date("2026-07-03T15:00:00.000Z"))).toBe("2026-07-04");
  });

  it("addDays shifts date keys", () => {
    expect(addDays("2026-07-04", -1)).toBe("2026-07-03");
    expect(addDays("2026-07-04", 1)).toBe("2026-07-05");
  });
});
