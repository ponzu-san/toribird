"use client";

import type { DailyRecord } from "@/types/diary";

interface RecordSummaryProps {
  record: DailyRecord;
  photoUrl: string | null;
  onEdit: () => void;
}

export default function RecordSummary({ record, photoUrl, onEdit }: RecordSummaryProps) {
  return (
    <div className="space-y-5">
      {record.weightGrams !== undefined && (
        <div className="rounded-xl bg-blue-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">体重</p>
          <p className="mt-1 text-3xl font-bold text-blue-900">
            {record.weightGrams}
            <span className="ml-1 text-lg font-medium">g</span>
          </p>
        </div>
      )}

      {record.memo && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">メモ</p>
          <p className="whitespace-pre-wrap rounded-xl bg-gray-50 px-4 py-3 text-gray-700">{record.memo}</p>
        </div>
      )}

      {photoUrl && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">写真</p>
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img src={photoUrl} alt="日記の写真" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      )}

      <button
        onClick={onEdit}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        編集する
      </button>
    </div>
  );
}
