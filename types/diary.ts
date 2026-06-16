export type DailyRecord = {
  id: string;
  date: string;
  parrotId?: string;
  weightGrams?: number;
  memo?: string;
  updatedAt: string;
};

export type DiaryFormData = {
  weightGrams?: number;
  memo?: string;
};

export type WeightPeriod = 7 | 30 | 365 | "all";
