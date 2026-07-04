"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUserSession } from "@/lib/auth/requireUser";
import { loadUserParrot, loadUserRecords, saveUserParrot, saveUserRecord, loadUserRecordByDate } from "@/lib/health/healthService";
import type { DailyRecord, DiaryFormData } from "@/types/diary";
import type { ParrotProfile, ProfileFormData } from "@/types/profile";
import { SPECIES_OTHER_ID } from "@/types/profile";
import { getDaysAgoKey, getTodayKey } from "@/lib/utils/date";
import type { WeightPeriod } from "@/types/diary";

export async function fetchRegisteredProfileAction(): Promise<ParrotProfile | null> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");
  return loadUserParrot(supabase, session.userId);
}

export async function saveRegisteredProfileAction(data: ProfileFormData): Promise<ParrotProfile> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");

  const existing = await loadUserParrot(supabase, session.userId);

  return saveUserParrot(supabase, session.userId, {
    id: existing?.id ?? crypto.randomUUID(),
    name: data.name.trim(),
    speciesId: data.speciesId,
    speciesCustom: data.speciesId === SPECIES_OTHER_ID ? data.speciesCustom?.trim() : undefined,
    sex: data.sex || undefined,
    birthday: data.birthday || undefined,
    adoptedOn: data.adoptedOn || undefined,
    bio: data.bio?.trim() || undefined,
  });
}

export async function fetchRegisteredRecordAction(date: string): Promise<DailyRecord | null> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");

  const parrot = await loadUserParrot(supabase, session.userId);
  if (!parrot) return null;

  return loadUserRecordByDate(supabase, parrot.id, date);
}

export async function saveRegisteredRecordAction(date: string, data: DiaryFormData): Promise<DailyRecord> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");

  let parrot = await loadUserParrot(supabase, session.userId);
  if (!parrot) {
    throw new Error("先にうちの子プロフィールを登録してください");
  }

  return saveUserRecord(supabase, parrot.id, date, {
    weightGrams: data.weightGrams,
    mood: data.mood,
    memo: data.memo,
  });
}

export async function fetchRegisteredRecordsAction(period: WeightPeriod): Promise<DailyRecord[]> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");

  const parrot = await loadUserParrot(supabase, session.userId);
  if (!parrot) return [];

  if (period === "all") {
    return loadUserRecords(supabase, parrot.id);
  }

  const fromDate = getDaysAgoKey(period);
  const toDate = getTodayKey();
  return loadUserRecords(supabase, parrot.id).then(records =>
    records.filter(r => r.date >= fromDate && r.date <= toDate),
  );
}

export async function fetchRegisteredRecordDatesAction(): Promise<string[]> {
  const session = await requireUserSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase が設定されていません");

  const parrot = await loadUserParrot(supabase, session.userId);
  if (!parrot) return [];

  const records = await loadUserRecords(supabase, parrot.id);
  return records.map(r => r.date);
}
