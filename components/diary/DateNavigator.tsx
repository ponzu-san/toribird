"use client";

import { formatDisplayDate, getTodayKey } from "@/lib/utils/date";

interface DateNavigatorProps {
  selectedDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenCalendar: () => void;
}

const navBtnClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-muted shadow-pop transition hover:border-primary hover:bg-sky-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 lg:h-11 lg:w-11";

export default function DateNavigator({ selectedDate, onPrevDay, onNextDay, onOpenCalendar }: DateNavigatorProps) {
  const today = getTodayKey();
  const isToday = selectedDate === today;
  const isNextDisabled = selectedDate >= today;

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPrevDay} className={navBtnClass} aria-label="前日">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 flex-row items-center justify-center gap-1.5">
        <p className="font-display whitespace-nowrap text-base font-bold text-foreground sm:text-lg">{formatDisplayDate(selectedDate)}</p>
        <button
          type="button"
          onClick={onOpenCalendar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted transition hover:border-border hover:bg-sky-soft hover:text-primary"
          aria-label="カレンダーを開く"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <button type="button" onClick={onNextDay} disabled={isNextDisabled} className={navBtnClass} aria-label="翌日">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
