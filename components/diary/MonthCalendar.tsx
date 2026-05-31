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
    <div
      className={
        variant === "plain"
          ? "p-0"
          : "rounded-2xl border border-border bg-surface-elevated p-4 shadow-pop lg:p-5"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-xl border border-transparent p-2 text-muted transition hover:border-border hover:bg-sky-soft hover:text-primary"
          aria-label="前月"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-display text-lg font-bold text-foreground">
            {year}年{month}月
          </h2>
        </div>

        <button
          onClick={onNextMonth}
          className="rounded-xl border border-transparent p-2 text-muted transition hover:border-border hover:bg-sky-soft hover:text-primary"
          aria-label="次月"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`py-1 text-center text-xs font-bold ${i === 0 ? "text-rose-500" : i === 6 ? "text-primary" : "text-muted"}`}
          >
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
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition ${
                isFuture
                  ? "cursor-not-allowed text-muted/40"
                  : isSelected
                    ? "border border-primary-dark bg-primary font-bold text-white shadow-pop"
                    : isToday
                      ? "border border-primary bg-sky-soft font-bold text-primary hover:bg-sky-soft/70"
                      : weekday === 0
                        ? "text-rose-500 hover:bg-rose-50"
                        : weekday === 6
                          ? "text-primary hover:bg-sky-soft"
                          : "text-foreground hover:bg-sky-soft/60"
              }`}
            >
              {day}
              {hasRecord && !isSelected && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={onGoToday}
        className="mt-4 w-full rounded-2xl border border-border py-2.5 text-sm font-semibold text-muted transition hover:border-primary hover:bg-sky-soft hover:text-primary"
      >
        今日（{formatDisplayDate(today)}）へ
      </button>
    </div>
  );
}
