"use client";

import { formatDisplayDate, getTodayKey } from "@/lib/utils/date";

interface DateNavigatorProps {
  selectedDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenCalendar: () => void;
}

export default function DateNavigator({ selectedDate, onPrevDay, onNextDay, onOpenCalendar }: DateNavigatorProps) {
  const today = getTodayKey();
  const isToday = selectedDate === today;
  const isNextDisabled = selectedDate >= today;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevDay}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
        aria-label="前日"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <p className="truncate text-lg font-bold text-gray-900">{formatDisplayDate(selectedDate)}</p>
        {isToday && <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">今日</span>}
        <button
          type="button"
          onClick={onOpenCalendar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
          aria-label="カレンダーを開く"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={onNextDay}
        disabled={isNextDisabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="翌日"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
