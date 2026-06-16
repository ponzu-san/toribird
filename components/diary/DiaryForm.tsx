"use client";

import { useState, useEffect } from "react";
import type { DailyRecord } from "@/types/diary";
import { MAX_MEMO_LENGTH, useDiaryStore } from "@/lib/stores/diaryStore";
import Button from "@/components/ui/Button";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-3 py-2.5 text-foreground placeholder:text-muted transition focus:border-primary focus:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary/25 lg:px-4";

interface DiaryFormProps {
  date: string;
  record: DailyRecord | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

export default function DiaryForm({ date, record, onSaved, onCancel }: DiaryFormProps) {
  const { saveDiaryEntry, isSaving, error, saveMessage, clearSaveMessage } = useDiaryStore();

  const [weight, setWeight] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    setWeight(record?.weightGrams !== undefined ? String(record.weightGrams) : "");
    setMemo(record?.memo ?? "");
    clearSaveMessage();
  }, [date, record, clearSaveMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightGrams = weight.trim() === "" ? undefined : parseFloat(weight);

    const success = await saveDiaryEntry(date, {
      weightGrams,
      memo,
    });

    if (success) {
      onSaved?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="mb-2 block text-sm font-semibold text-muted">
          体重（g）
        </label>
        <input
          id="weight"
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          placeholder="例: 95.5"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className={`font-display ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="memo" className="mb-2 block text-sm font-semibold text-muted">
          メモ
        </label>
        <textarea
          id="memo"
          rows={4}
          maxLength={MAX_MEMO_LENGTH}
          placeholder="今日の様子、ごはん、おもちゃなど..."
          value={memo}
          onChange={e => setMemo(e.target.value)}
          className={`resize-none ${inputClass}`}
        />
        <p className="mt-1.5 text-right text-xs text-muted">
          {memo.length}/{MAX_MEMO_LENGTH}
        </p>
      </div>

      {error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      {saveMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{saveMessage}</div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={isSaving} fullWidth className={onCancel ? "flex-1" : ""}>
          {isSaving ? "保存中..." : "保存する"}
        </Button>
      </div>
    </form>
  );
}
