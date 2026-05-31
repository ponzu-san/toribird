"use client";

import { useState, useEffect } from "react";
import type { DailyRecord } from "@/types/diary";
import { MAX_MEMO_LENGTH, useDiaryStore } from "@/lib/stores/diaryStore";
import PhotoPicker from "./PhotoPicker";

interface DiaryFormProps {
  date: string;
  record: DailyRecord | null;
  photoUrl: string | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

export default function DiaryForm({ date, record, photoUrl, onSaved, onCancel }: DiaryFormProps) {
  const { saveDiaryEntry, isSaving, error, saveMessage, clearSaveMessage } = useDiaryStore();

  const [weight, setWeight] = useState("");
  const [memo, setMemo] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    setWeight(record?.weightGrams !== undefined ? String(record.weightGrams) : "");
    setMemo(record?.memo ?? "");
    setPhotoFile(null);
    setRemovePhoto(false);
    clearSaveMessage();
  }, [date, record, clearSaveMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightGrams = weight.trim() === "" ? undefined : parseFloat(weight);

    const success = await saveDiaryEntry(date, {
      weightGrams,
      memo,
      photoFile,
      removePhoto,
    });

    if (success) {
      onSaved?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="weight" className="mb-2 block text-sm font-medium text-gray-700">
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
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label htmlFor="memo" className="mb-2 block text-sm font-medium text-gray-700">
          メモ
        </label>
        <textarea
          id="memo"
          rows={4}
          maxLength={MAX_MEMO_LENGTH}
          placeholder="今日の様子、ごはん、おもちゃなど..."
          value={memo}
          onChange={e => setMemo(e.target.value)}
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {memo.length}/{MAX_MEMO_LENGTH}
        </p>
      </div>

      <PhotoPicker
        previewUrl={removePhoto ? null : photoUrl}
        onPhotoChange={file => {
          setPhotoFile(file);
          if (file) setRemovePhoto(false);
        }}
        onRemovePhoto={() => setRemovePhoto(true)}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {saveMessage && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{saveMessage}</div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "保存中..." : "保存する"}
        </button>
      </div>
    </form>
  );
}
