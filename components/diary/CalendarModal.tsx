"use client";

import { useEffect, useState } from "react";
import { addMonths, getMonthStartKey, getTodayKey } from "@/lib/utils/date";
import MonthCalendar from "./MonthCalendar";

interface CalendarModalProps {
  isOpen: boolean;
  selectedDate: string;
  recordDates: string[];
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

export default function CalendarModal({ isOpen, selectedDate, recordDates, onSelectDate, onClose }: CalendarModalProps) {
  const today = getTodayKey();
  const [monthKey, setMonthKey] = useState(getMonthStartKey(selectedDate));

  useEffect(() => {
    if (isOpen) {
      setMonthKey(getMonthStartKey(selectedDate));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, selectedDate]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectDate = (date: string) => {
    onSelectDate(date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />

      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-pop-hover"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">日付を選ぶ</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-primary hover:bg-sky-soft hover:text-primary"
            aria-label="閉じる"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <MonthCalendar
            variant="plain"
            monthKey={monthKey}
            selectedDate={selectedDate}
            recordDates={recordDates}
            onSelectDate={handleSelectDate}
            onPrevMonth={() => setMonthKey(prev => addMonths(prev, -1))}
            onNextMonth={() => setMonthKey(prev => addMonths(prev, 1))}
            onGoToday={() => handleSelectDate(today)}
          />
        </div>
      </div>
    </div>
  );
}
