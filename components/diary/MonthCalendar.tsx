"use client";

import { useMemo } from "react";
import { formatDisplayDate, getMonthDays, getTodayKey, isFutureDate, parseDateKey } from "@/lib/utils/date";

interface MonthCalendarProps {
  monthKey: string;
  selectedDate: string;
  recordDates: string[];
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  variant?: "default" | "plain";
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function MonthCalendar({
  monthKey,
  selectedDate,
  recordDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  variant = "default",
}: MonthCalendarProps) {
  const recordDateSet = useMemo(() => new Set(recordDates), [recordDates]);

  const { year, month, days, startWeekday } = useMemo(() => {
    const [y, m] = monthKey.split("-").map(Number);
    const monthDays = getMonthDays(y, m);
    const firstDay = parseDateKey(monthDays[0]);
    const jstDay = new Date(firstDay.getTime() + 9 * 60 * 60 * 1000).getUTCDay();
    return { year: y, month: m, days: monthDays, startWeekday: jstDay };
  }, [monthKey]);

  const today = getTodayKey();
  const blanks = Array.from({ length: startWeekday });

  return (
    <div className={variant === "plain" ? "p-0" : "rounded-xl border border-gray-200 bg-white p-4"}>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onPrevMonth} className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100" aria-label="前月">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">
            {year}年{month}月
          </h2>
        </div>

        <button onClick={onNextMonth} className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100" aria-label="次月">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, i) => (
          <div key={day} className={`py-1 text-center text-xs font-medium ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map(dateKey => {
          const day = parseInt(dateKey.split("-")[2], 10);
          const isFuture = isFutureDate(dateKey);
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === today;
          const hasRecord = recordDateSet.has(dateKey);
          const weekday = new Date(parseDateKey(dateKey).getTime() + 9 * 60 * 60 * 1000).getUTCDay();

          return (
            <button
              key={dateKey}
              disabled={isFuture}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                isFuture
                  ? "cursor-not-allowed text-gray-300"
                  : isSelected
                    ? "bg-blue-600 font-bold text-white"
                    : isToday
                      ? "bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100"
                      : weekday === 0
                        ? "text-red-600 hover:bg-red-50"
                        : weekday === 6
                          ? "text-blue-600 hover:bg-blue-50"
                          : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
              {hasRecord && !isSelected && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onGoToday}
        className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
      >
        今日（{formatDisplayDate(today)}）へ
      </button>
    </div>
  );
}
