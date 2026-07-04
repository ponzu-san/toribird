"use server";

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUserSession } from "@/lib/auth/requireUser";
import { saveUserParrot, saveUserRecord } from "@/lib/health/healthService";
import { GUEST_COOKIE_NAME } from "@/lib/guest/constants";
import { SPECIES_OTHER_ID } from "@/types/profile";
import type { DailyRecord } from "@/types/diary";
import type { ParrotProfile } from "@/types/profile";

export type GuestExportPayload = {
  profile: Omit<ParrotProfile, "updatedAt"> | null;
  records: DailyRecord[];
};

export async function mergeGuestDataAction(payload: GuestExportPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const session = await requireUserSession();
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { ok: false, error: "Supabase が設定されていません" };
    }

    let parrotId: string | null = null;

    if (payload.profile) {
      const parrot = await saveUserParrot(supabase, session.userId, {
        id: crypto.randomUUID(),
        name: payload.profile.name,
        speciesId: payload.profile.speciesId,
        speciesCustom: payload.profile.speciesCustom,
        sex: payload.profile.sex,
        birthday: payload.profile.birthday,
        adoptedOn: payload.profile.adoptedOn,
        bio: payload.profile.bio,
      });
      parrotId = parrot.id;
    }

    if (parrotId && payload.records.length > 0) {
      for (const record of payload.records) {
        await saveUserRecord(supabase, parrotId, record.date, {
          weightGrams: record.weightGrams,
          mood: record.mood,
          memo: record.memo,
        });
      }
    } else if (!parrotId && payload.records.length > 0) {
      const parrot = await saveUserParrot(supabase, session.userId, {
        id: crypto.randomUUID(),
        name: "うちの子",
        speciesId: SPECIES_OTHER_ID,
      });
      parrotId = parrot.id;
      for (const record of payload.records) {
        await saveUserRecord(supabase, parrotId, record.date, {
          weightGrams: record.weightGrams,
          mood: record.mood,
          memo: record.memo,
        });
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete(GUEST_COOKIE_NAME);

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "マージに失敗しました";
    return { ok: false, error: message };
  }
}

export async function clearGuestCookieAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_COOKIE_NAME);
}
