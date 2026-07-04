import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { GUEST_TRIAL_DAYS } from "@/lib/guest/constants";
import { getGuestDaysRemaining } from "@/lib/guest/guestSession";
import { guestPresetLabel, guestStartedAtForPreset } from "@/lib/dev/guestPresets";

describe("guestStartedAtForPreset", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-04T12:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("active preset yields 7 days remaining", () => {
    const startedAt = guestStartedAtForPreset("active");
    expect(getGuestDaysRemaining(startedAt)).toBe(GUEST_TRIAL_DAYS);
  });

  it("last_day preset yields 1 day remaining", () => {
    const startedAt = guestStartedAtForPreset("last_day");
    expect(getGuestDaysRemaining(startedAt)).toBe(1);
  });

  it("expired preset yields 0 days remaining", () => {
    const startedAt = guestStartedAtForPreset("expired");
    expect(getGuestDaysRemaining(startedAt)).toBe(0);
  });
});

describe("guestPresetLabel", () => {
  it("returns Japanese labels", () => {
    expect(guestPresetLabel("active")).toBe("ゲスト（7日）");
    expect(guestPresetLabel("last_day")).toBe("ゲスト（残1日）");
    expect(guestPresetLabel("expired")).toBe("ゲスト（期限切れ）");
  });
});
