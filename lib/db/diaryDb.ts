import Dexie, { type EntityTable } from "dexie";
import type { DailyRecord, Photo } from "@/types/diary";

class DiaryDatabase extends Dexie {
  dailyRecords!: EntityTable<DailyRecord, "id">;
  photos!: EntityTable<Photo, "id">;

  constructor() {
    super("toribird-diary");
    this.version(1).stores({
      dailyRecords: "id, &date, parrotId, updatedAt",
      photos: "id, createdAt",
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

export async function getPhotoById(id: string): Promise<Photo | undefined> {
  return db.photos.get(id);
}

export async function savePhoto(blob: Blob): Promise<Photo> {
  const photo: Photo = {
    id: crypto.randomUUID(),
    blob,
    mimeType: blob.type || "image/jpeg",
    createdAt: new Date().toISOString(),
  };
  await db.photos.add(photo);
  return photo;
}

export async function deletePhoto(id: string): Promise<void> {
  await db.photos.delete(id);
}

export async function upsertRecord(
  date: string,
  data: {
    weightGrams?: number;
    memo?: string;
    photoId?: string;
    parrotId?: string;
  },
): Promise<DailyRecord> {
  const existing = await getRecordByDate(date);
  const now = new Date().toISOString();

  if (existing) {
    const updated: DailyRecord = {
      ...existing,
      weightGrams: data.weightGrams,
      memo: data.memo,
      photoId: data.photoId,
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
    memo: data.memo,
    photoId: data.photoId,
    parrotId: data.parrotId,
    updatedAt: now,
  };
  await db.dailyRecords.add(record);
  return record;
}

export async function deleteRecord(date: string): Promise<void> {
  const record = await getRecordByDate(date);
  if (!record) return;

  if (record.photoId) {
    await deletePhoto(record.photoId);
  }
  await db.dailyRecords.delete(record.id);
}

export function createPhotoUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
