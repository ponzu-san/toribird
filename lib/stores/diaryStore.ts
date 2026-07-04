import { create } from "zustand";
import type { DailyRecord, DiaryFormData, WeightPeriod } from "@/types/diary";
import { PROFILE_DEFAULT_ID } from "@/types/profile";
import {
  getAllRecordDates,
  getAllWeightRecords,
  getRecordByDate,
  getRecordsInRange,
  upsertRecord,
} from "@/lib/db/diaryDb";
import {
  fetchRegisteredRecordAction,
  fetchRegisteredRecordDatesAction,
  fetchRegisteredRecordsAction,
  saveRegisteredRecordAction,
} from "@/lib/actions/healthRecords";
import { useAccessStore } from "@/lib/stores/accessStore";
import { getDaysAgoKey, getTodayKey } from "@/lib/utils/date";

const MAX_MEMO_LENGTH = 500;

type DiaryState = {
  selectedDate: string;
  currentRecord: DailyRecord | null;
  recordDates: string[];
  weightRecords: DailyRecord[];
  weightPeriod: WeightPeriod;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  error: string | null;

  setSelectedDate: (date: string) => void;
  loadRecordForDate: (date: string) => Promise<void>;
  loadRecordDates: () => Promise<void>;
  loadWeightRecords: (period?: WeightPeriod) => Promise<void>;
  setWeightPeriod: (period: WeightPeriod) => void;
  saveDiaryEntry: (date: string, data: DiaryFormData) => Promise<boolean>;
  clearSaveMessage: () => void;
  init: () => Promise<void>;
};

function validateFormData(data: DiaryFormData): string | null {
  if (data.weightGrams !== undefined && data.weightGrams !== null) {
    if (Number.isNaN(data.weightGrams) || data.weightGrams <= 0) {
      return "体重は0より大きい数値を入力してください";
    }
    if (data.weightGrams > 10000) {
      return "体重の値が大きすぎます";
    }
  }

  if (data.memo && data.memo.length > MAX_MEMO_LENGTH) {
    return `メモは${MAX_MEMO_LENGTH}文字以内で入力してください`;
  }

  const hasWeight = data.weightGrams !== undefined && data.weightGrams !== null && !Number.isNaN(data.weightGrams);
  const hasMemo = !!data.memo?.trim();
  const hasMood = !!data.mood;

  if (!hasWeight && !hasMemo && !hasMood) {
    return "体重・調子・メモのいずれかを入力してください";
  }

  return null;
}

function isRegisteredMode(): boolean {
  return useAccessStore.getState().mode === "registered";
}

function isReadOnlyMode(): boolean {
  return useAccessStore.getState().isReadOnly;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  selectedDate: getTodayKey(),
  currentRecord: null,
  recordDates: [],
  weightRecords: [],
  weightPeriod: 30,
  isLoading: false,
  isSaving: false,
  saveMessage: null,
  error: null,

  setSelectedDate: date => {
    set({ selectedDate: date });
  },

  loadRecordForDate: async date => {
    set({ isLoading: true, error: null });

    try {
      let record: DailyRecord | null | undefined;

      if (isRegisteredMode()) {
        record = await fetchRegisteredRecordAction(date);
      } else {
        record = await getRecordByDate(date);
      }

      set({ currentRecord: record ?? null, isLoading: false });
    } catch {
      set({ error: "記録の読み込みに失敗しました", isLoading: false });
    }
  },

  loadRecordDates: async () => {
    try {
      const dates = isRegisteredMode() ? await fetchRegisteredRecordDatesAction() : await getAllRecordDates();
      set({ recordDates: dates });
    } catch {
      set({ error: "記録日の読み込みに失敗しました" });
    }
  },

  setWeightPeriod: period => {
    set({ weightPeriod: period });
  },

  loadWeightRecords: async period => {
    const selectedPeriod = period ?? get().weightPeriod;

    try {
      let records: DailyRecord[];

      if (isRegisteredMode()) {
        records = await fetchRegisteredRecordsAction(selectedPeriod);
        if (selectedPeriod !== "all") {
          records = records.filter(r => r.weightGrams !== undefined);
        }
      } else if (selectedPeriod === "all") {
        records = await getAllWeightRecords();
      } else {
        const fromDate = getDaysAgoKey(selectedPeriod);
        const toDate = getTodayKey();
        records = (await getRecordsInRange(fromDate, toDate)).filter(r => r.weightGrams !== undefined);
      }

      set({ weightRecords: records, weightPeriod: selectedPeriod });
    } catch {
      set({ error: "体重データの読み込みに失敗しました" });
    }
  },

  saveDiaryEntry: async (date, data) => {
    if (isReadOnlyMode()) {
      set({ error: "体験期間が終了しました。登録すると記録を続けられます", saveMessage: null });
      return false;
    }

    const validationError = validateFormData(data);
    if (validationError) {
      set({ error: validationError, saveMessage: null });
      return false;
    }

    set({ isSaving: true, error: null, saveMessage: null });

    try {
      const hasWeight = data.weightGrams !== undefined && data.weightGrams !== null && !Number.isNaN(data.weightGrams);
      const hasMemo = data.memo !== undefined && data.memo.trim() !== "";

      if (isRegisteredMode()) {
        await saveRegisteredRecordAction(date, {
          weightGrams: hasWeight ? data.weightGrams : undefined,
          mood: data.mood,
          memo: hasMemo ? data.memo!.trim() : undefined,
        });
      } else {
        await upsertRecord(date, {
          weightGrams: hasWeight ? data.weightGrams : undefined,
          mood: data.mood,
          memo: hasMemo ? data.memo!.trim() : undefined,
          parrotId: PROFILE_DEFAULT_ID,
        });
      }

      await get().loadRecordForDate(date);
      await get().loadRecordDates();
      await get().loadWeightRecords();

      set({ isSaving: false, saveMessage: "保存しました" });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存に失敗しました";
      set({ isSaving: false, error: message });
      return false;
    }
  },

  clearSaveMessage: () => set({ saveMessage: null, error: null }),

  init: async () => {
    await useAccessStore.getState().init();

    const { selectedDate } = get();
    const date = selectedDate || getTodayKey();
    if (!selectedDate) {
      set({ selectedDate: date });
    }
    await get().loadRecordDates();
    await get().loadWeightRecords();
  },
}));

export { MAX_MEMO_LENGTH };
