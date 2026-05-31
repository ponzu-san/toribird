export type DailyRecord = {
  id: string;
  date: string;
  parrotId?: string;
  weightGrams?: number;
  memo?: string;
  photoId?: string;
  updatedAt: string;
};

export type Photo = {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
};

export type DiaryFormData = {
  weightGrams?: number;
  memo?: string;
  photoFile?: File | null;
  removePhoto?: boolean;
};

export type WeightPeriod = 7 | 30 | 365 | "all";
