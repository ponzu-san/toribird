import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { GUEST_TRIAL_DAYS } from "@/lib/guest/constants";
import { getGuestDaysRemaining, isGuestReadOnly } from "@/lib/guest/guestSession";

describe("getGuestDaysRemaining", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-04T12:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns full trial days on start day", () => {
    const startedAt = "2026-07-04T03:00:00.000Z";
    expect(getGuestDaysRemaining(startedAt)).toBe(GUEST_TRIAL_DAYS);
  });

  it("returns 1 when one day remains", () => {
    const startedAt = "2026-06-28T03:00:00.000Z";
    expect(getGuestDaysRemaining(startedAt)).toBe(1);
  });

  it("returns 0 after trial expires", () => {
    const startedAt = "2026-06-20T03:00:00.000Z";
    expect(getGuestDaysRemaining(startedAt)).toBe(0);
  });
});

describe("isGuestReadOnly", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-04T12:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false during active trial", () => {
    expect(isGuestReadOnly("2026-07-04T03:00:00.000Z")).toBe(false);
  });

  it("is true when trial expired", () => {
    expect(isGuestReadOnly("2026-06-20T03:00:00.000Z")).toBe(true);
  });
});
