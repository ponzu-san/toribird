"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";
import { requireUserSession } from "@/lib/auth/requireUser";
import { isDevToolsEnabled } from "@/lib/dev/isDevToolsEnabled";
import { getDevTestCredentials } from "@/lib/dev/devTestCredentials";
import { guestStartedAtForPreset, type GuestPreset } from "@/lib/dev/guestPresets";
import { GUEST_COOKIE_NAME } from "@/lib/guest/constants";
import type { SubscriptionPlan } from "@/types/health";

export type DevActionResult = { ok: true } | { error: string };

function assertDevToolsEnabled() {
  if (!isDevToolsEnabled()) {
    throw new Error("開発用ツールは有効化されていません");
  }
}

async function upsertSubscriptionPlan(userId: string, plan: SubscriptionPlan): Promise<DevActionResult> {
  const serviceSupabase = createSupabaseServiceRoleClient();
  if (!serviceSupabase) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY が設定されていません" };
  }

  const { error } = await serviceSupabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { error: `プラン更新に失敗しました: ${error.message}` };
  }

  return { ok: true };
}

export async function devSwitchGuest(preset: GuestPreset): Promise<DevActionResult> {
  assertDevToolsEnabled();

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const startedAt = guestStartedAtForPreset(preset);
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE_NAME, startedAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function devSwitchPlan(plan: SubscriptionPlan): Promise<DevActionResult> {
  assertDevToolsEnabled();

  let session;
  try {
    session = await requireUserSession();
  } catch {
    return { error: "ログインが必要です" };
  }

  const result = await upsertSubscriptionPlan(session.userId, plan);
  if ("error" in result) {
    return result;
  }

  const cookieStore = await cookies();
  cookieStore.delete(GUEST_COOKIE_NAME);

  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return { ok: true };
}

export async function devSwitchToRegistered(plan: SubscriptionPlan): Promise<DevActionResult> {
  assertDevToolsEnabled();

  const credentials = getDevTestCredentials();
  if (!credentials) {
    return { error: "DEV_TEST_EMAIL / DEV_TEST_PASSWORD を .env.local に設定してください" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase が設定されていません" };
  }

  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(GUEST_COOKIE_NAME);

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInError || !data.user) {
    return {
      error: "テストアカウントでログインできません。DEV_TEST_* と Supabase Users を確認してください",
    };
  }

  const planResult = await upsertSubscriptionPlan(data.user.id, plan);
  if ("error" in planResult) {
    return planResult;
  }

  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return { ok: true };
}
