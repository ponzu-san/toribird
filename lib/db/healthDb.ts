import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyRecord } from "@/types/diary";
import type { Mood, ParrotSex } from "@/types/health";
import type { ParrotProfile } from "@/types/profile";
import { SPECIES_OTHER_ID } from "@/types/profile";

type UserParrotRow = {
  id: string;
  user_id: string;
  name: string;
  species_id: string | null;
  species_custom: string | null;
  sex: ParrotSex | null;
  birthday: string | null;
  adopted_on: string | null;
  photo_url: string | null;
  baseline_weight_g: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  species?: { name: string } | null;
};

type DailyRecordRow = {
  id: string;
  parrot_id: string;
  record_date: string;
  weight_g: number | null;
  mood: Mood | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

function mapParrotRow(row: UserParrotRow): ParrotProfile {
  let speciesId = SPECIES_OTHER_ID;
  if (row.species_id && row.species?.name) {
    speciesId = row.species.name;
  }

  return {
    id: row.id,
    name: row.name,
    speciesId,
    speciesCustom: row.species_custom ?? undefined,
    sex: row.sex ?? undefined,
    birthday: row.birthday ?? undefined,
    adoptedOn: row.adopted_on ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    updatedAt: row.updated_at,
  };
}

function mapRecordRow(row: DailyRecordRow): DailyRecord {
  return {
    id: row.id,
    date: row.record_date,
    parrotId: row.parrot_id,
    weightGrams: row.weight_g ?? undefined,
    mood: row.mood ?? undefined,
    memo: row.memo ?? undefined,
    updatedAt: row.updated_at,
  };
}

export async function fetchUserParrots(supabase: SupabaseClient, userId: string): Promise<ParrotProfile[]> {
  const { data, error } = await supabase
    .from("user_parrots")
    .select("*, species:species_id(name)")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as UserParrotRow[]).map(mapParrotRow);
}

export async function upsertUserParrot(
  supabase: SupabaseClient,
  userId: string,
  profile: Omit<ParrotProfile, "updatedAt">,
): Promise<ParrotProfile> {
  const payload = {
    id: profile.id,
    user_id: userId,
    name: profile.name,
    species_id: profile.speciesId === SPECIES_OTHER_ID ? null : profile.speciesId,
    species_custom: profile.speciesCustom ?? null,
    sex: profile.sex ?? null,
    birthday: profile.birthday ?? null,
    adopted_on: profile.adoptedOn ?? null,
    photo_url: profile.photoUrl ?? null,
  };

  const { data, error } = await supabase.from("user_parrots").upsert(payload).select("*, species:species_id(name)").single();
  if (error) throw error;
  return mapParrotRow(data as UserParrotRow);
}

export async function fetchDailyRecords(supabase: SupabaseClient, parrotId: string, fromDate?: string, toDate?: string): Promise<DailyRecord[]> {
  let query = supabase.from("daily_records").select("*").eq("parrot_id", parrotId).order("record_date", { ascending: true });

  if (fromDate) {
    query = query.gte("record_date", fromDate);
  }
  if (toDate) {
    query = query.lte("record_date", toDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as DailyRecordRow[]).map(mapRecordRow);
}

export async function upsertDailyRecord(
  supabase: SupabaseClient,
  parrotId: string,
  date: string,
  data: { weightGrams?: number; mood?: Mood; memo?: string },
): Promise<DailyRecord> {
  const payload = {
    parrot_id: parrotId,
    record_date: date,
    weight_g: data.weightGrams ?? null,
    mood: data.mood ?? null,
    memo: data.memo ?? null,
  };

  const { data: row, error } = await supabase.from("daily_records").upsert(payload, { onConflict: "parrot_id,record_date" }).select("*").single();
  if (error) throw error;
  return mapRecordRow(row as DailyRecordRow);
}
