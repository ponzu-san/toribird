import Dexie, { type EntityTable } from "dexie";
import type { DailyRecord } from "@/types/diary";
import type { ParrotProfile } from "@/types/profile";
import { PROFILE_DEFAULT_ID } from "@/types/profile";

class DiaryDatabase extends Dexie {
  dailyRecords!: EntityTable<DailyRecord, "id">;
  profiles!: EntityTable<ParrotProfile, "id">;

  constructor() {
    super("toribird-diary");
    this.version(1).stores({
      dailyRecords: "id, &date, parrotId, updatedAt",
      photos: "id, createdAt",
    });
    this.version(2).stores({
      dailyRecords: "id, &date, parrotId, updatedAt",
      profiles: "id, updatedAt",
    });
    this.version(3).stores({
      dailyRecords: "id, &date, parrotId, updatedAt",
      profiles: "id, updatedAt",
    });
  }
}

export const db = new DiaryDatabase();

export async function getRecordByDate(date: string): Promise<DailyRecord | undefined> {
  return db.dailyRecords.where("date").equals(date).first();
}

export async function getRecordsInRange(fromDate: string, toDate: string): Promise<DailyRecord[]> {
  return db.dailyRecords.where("date").between(fromDate, toDate, true, true).sortBy("date");
}

export async function getAllRecordDates(): Promise<string[]> {
  const records = await db.dailyRecords.orderBy("date").toArray();
  return records.map(r => r.date);
}

export async function getAllWeightRecords(): Promise<DailyRecord[]> {
  const records = await db.dailyRecords.orderBy("date").toArray();
  return records.filter(r => r.weightGrams !== undefined);
}

export async function getProfile(id: string = PROFILE_DEFAULT_ID): Promise<ParrotProfile | undefined> {
  return db.profiles.get(id);
}

export async function upsertProfile(data: Omit<ParrotProfile, "id" | "updatedAt"> & { id?: string }): Promise<ParrotProfile> {
  const id = data.id ?? PROFILE_DEFAULT_ID;
  const existing = await db.profiles.get(id);
  const now = new Date().toISOString();

  const profile: ParrotProfile = {
    id,
    name: data.name,
    speciesId: data.speciesId,
    speciesCustom: data.speciesCustom,
    sex: data.sex,
    birthday: data.birthday,
    adoptedOn: data.adoptedOn,
    photoUrl: data.photoUrl,
    bio: data.bio,
    updatedAt: now,
  };

  if (existing) {
    await db.profiles.put(profile);
  } else {
    await db.profiles.add(profile);
  }

  return profile;
}

export async function upsertRecord(
  date: string,
  data: {
    weightGrams?: number;
    mood?: DailyRecord["mood"];
    memo?: string;
    parrotId?: string;
  },
): Promise<DailyRecord> {
  const existing = await getRecordByDate(date);
  const now = new Date().toISOString();

  if (existing) {
    const updated: DailyRecord = {
      ...existing,
      weightGrams: data.weightGrams,
      mood: data.mood,
      memo: data.memo,
      parrotId: data.parrotId ?? existing.parrotId,
      updatedAt: now,
    };
    await db.dailyRecords.put(updated);
    return updated;
  }

  const record: DailyRecord = {
    id: crypto.randomUUID(),
    date,
    weightGrams: data.weightGrams,
    mood: data.mood,
    memo: data.memo,
    parrotId: data.parrotId,
    updatedAt: now,
  };
  await db.dailyRecords.add(record);
  return record;
}

export async function deleteRecord(date: string): Promise<void> {
  const record = await getRecordByDate(date);
  if (!record) return;
  await db.dailyRecords.delete(record.id);
}
