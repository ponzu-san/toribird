import type { Mood } from "@/types/health";

export type DailyRecord = {
  id: string;
  date: string;
  parrotId?: string;
  weightGrams?: number;
  mood?: Mood;
  memo?: string;
  updatedAt: string;
};

export type DiaryFormData = {
  weightGrams?: number;
  mood?: Mood;
  memo?: string;
};

export type WeightPeriod = 7 | 30 | 90 | "all";
