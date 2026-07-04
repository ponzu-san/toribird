import { GUEST_TRIAL_DAYS } from "@/lib/guest/constants";

export type GuestPreset = "active" | "last_day" | "expired";

const PRESET_DAYS_REMAINING: Record<GuestPreset, number> = {
  active: GUEST_TRIAL_DAYS,
  last_day: 1,
  expired: 0,
};

export function guestStartedAtForPreset(preset: GuestPreset): string {
  const daysRemaining = PRESET_DAYS_REMAINING[preset];
  const elapsedDays = GUEST_TRIAL_DAYS - daysRemaining;
  const startedAt = new Date();
  startedAt.setDate(startedAt.getDate() - elapsedDays);
  return startedAt.toISOString();
}

export function guestPresetLabel(preset: GuestPreset): string {
  switch (preset) {
    case "active":
      return "ゲスト（7日）";
    case "last_day":
      return "ゲスト（残1日）";
    case "expired":
      return "ゲスト（期限切れ）";
  }
}
