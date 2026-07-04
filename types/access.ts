import type { SubscriptionPlan } from "@/types/health";

export type AccessMode = "visitor" | "guest" | "registered";

export type HealthContext = {
  mode: AccessMode;
  userId?: string;
  guestStartedAt?: string;
  isReadOnly: boolean;
  daysRemaining: number | null;
  plan?: SubscriptionPlan;
};
