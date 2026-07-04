"use server";

import { cookies } from "next/headers";
import { getUserSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GUEST_COOKIE_NAME } from "@/lib/guest/constants";
import { getGuestDaysRemaining, isGuestReadOnly } from "@/lib/guest/guestSession";
import type { HealthContext } from "@/types/access";
import type { SubscriptionPlan } from "@/types/health";

async function fetchUserPlan(userId: string): Promise<SubscriptionPlan> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return "free";
  }

  const { data } = await supabase.from("subscriptions").select("plan").eq("user_id", userId).maybeSingle();

  if (data?.plan === "plus") {
    return "plus";
  }

  return "free";
}

export async function getHealthContext(): Promise<HealthContext> {
  const session = await getUserSession();
  if (session) {
    const plan = await fetchUserPlan(session.userId);
    return {
      mode: "registered",
      userId: session.userId,
      isReadOnly: false,
      daysRemaining: null,
      plan,
    };
  }

  const cookieStore = await cookies();
  const guestStartedAt = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (guestStartedAt) {
    return {
      mode: "guest",
      guestStartedAt,
      isReadOnly: isGuestReadOnly(guestStartedAt),
      daysRemaining: getGuestDaysRemaining(guestStartedAt),
    };
  }

  return {
    mode: "visitor",
    isReadOnly: true,
    daysRemaining: null,
  };
}
