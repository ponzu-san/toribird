"use client";

import type { DailyRecord } from "@/types/diary";
import Button from "@/components/ui/Button";

interface RecordSummaryProps {
  record: DailyRecord;
  photoUrl: string | null;
  onEdit: () => void;
}

export default function RecordSummary({ record, photoUrl, onEdit }: RecordSummaryProps) {
  return (
    <div className="space-y-4">
      {record.weightGrams !== undefined && (
        <div className="flex items-baseline gap-2 rounded-2xl border border-border bg-sky-soft p-4">
          <span className="shrink-0 text-sm font-bold text-primary">体重</span>
          <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
            {record.weightGrams}
            <span className="ml-0.5 text-base font-semibold text-foreground sm:text-lg">g</span>
          </p>
        </div>
      )}

      {record.memo && (
        <div>
          <p className="mb-1.5 text-sm font-semibold text-muted">メモ</p>
          <p className="whitespace-pre-wrap rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
            {record.memo}
          </p>
        </div>
      )}

      {photoUrl && (
        <div>
          <p className="mb-1.5 text-sm font-semibold text-muted">写真</p>
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
            <img src={photoUrl} alt="日記の写真" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={onEdit}>
        編集する
      </Button>
    </div>
  );
}
