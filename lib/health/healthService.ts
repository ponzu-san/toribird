import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyRecord } from "@/types/diary";
import type { ParrotProfile } from "@/types/profile";
import { SPECIES_OTHER_ID } from "@/types/profile";
import {
  fetchDailyRecords,
  fetchUserParrots,
  upsertDailyRecord,
  upsertUserParrot,
} from "@/lib/db/healthDb";
import { resolveSpeciesId } from "@/lib/health/speciesResolver";

export async function loadUserParrot(supabase: SupabaseClient, userId: string): Promise<ParrotProfile | null> {
  const parrots = await fetchUserParrots(supabase, userId);
  return parrots[0] ?? null;
}

export async function loadUserRecords(supabase: SupabaseClient, parrotId: string): Promise<DailyRecord[]> {
  return fetchDailyRecords(supabase, parrotId);
}

export async function saveUserParrot(
  supabase: SupabaseClient,
  userId: string,
  profile: Omit<ParrotProfile, "updatedAt">,
): Promise<ParrotProfile> {
  const species = await resolveSpeciesId(supabase, profile.speciesId, profile.speciesCustom);
  return upsertUserParrot(supabase, userId, {
    ...profile,
    speciesId: species.speciesId ?? SPECIES_OTHER_ID,
    speciesCustom: species.speciesCustom ?? profile.speciesCustom,
  });
}

export async function saveUserRecord(
  supabase: SupabaseClient,
  parrotId: string,
  date: string,
  data: { weightGrams?: number; mood?: DailyRecord["mood"]; memo?: string },
): Promise<DailyRecord> {
  return upsertDailyRecord(supabase, parrotId, date, data);
}

export async function loadAllUserRecords(supabase: SupabaseClient, parrotId: string): Promise<DailyRecord[]> {
  return fetchDailyRecords(supabase, parrotId);
}

export async function loadUserRecordByDate(
  supabase: SupabaseClient,
  parrotId: string,
  date: string,
): Promise<DailyRecord | null> {
  const records = await fetchDailyRecords(supabase, parrotId, date, date);
  return records[0] ?? null;
}
