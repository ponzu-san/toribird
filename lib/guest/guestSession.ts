import { GUEST_TRIAL_DAYS } from "@/lib/guest/constants";

export function getGuestDaysRemaining(startedAt: string): number {
  const start = new Date(startedAt).getTime();
  const elapsedMs = Date.now() - start;
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  return Math.max(0, GUEST_TRIAL_DAYS - elapsedDays);
}

export function isGuestReadOnly(startedAt: string): boolean {
  return getGuestDaysRemaining(startedAt) <= 0;
}
