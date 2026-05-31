"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDiaryStore } from "@/lib/stores/diaryStore";
import { addDays, getTodayKey } from "@/lib/utils/date";
import DiaryForm from "@/components/diary/DiaryForm";
import RecordSummary from "@/components/diary/RecordSummary";
import LocalStorageNotice from "@/components/diary/LocalStorageNotice";
import DateNavigator from "@/components/diary/DateNavigator";
import CalendarModal from "@/components/diary/CalendarModal";

export default function TodayPage() {
  const today = getTodayKey();
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    selectedDate,
    currentRecord,
    photoUrl,
    recordDates,
    isLoading,
    init,
    setSelectedDate,
    loadRecordForDate,
    loadRecordDates,
  } = useDiaryStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    loadRecordForDate(selectedDate);
    setIsEditing(false);
  }, [selectedDate, loadRecordForDate]);

  const hasRecord =
    currentRecord &&
    (currentRecord.weightGrams !== undefined || currentRecord.memo || currentRecord.photoId);

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    const next = addDays(selectedDate, 1);
    if (next <= today) {
      setSelectedDate(next);
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-24 lg:pb-8">
      <div className="mx-auto max-w-lg px-4 py-8">
        <header className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600">日記</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasRecord ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {hasRecord ? "記録済み" : "未記録"}
            </span>
          </div>
          <DateNavigator
            selectedDate={selectedDate}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onOpenCalendar={() => setIsCalendarOpen(true)}
          />
        </header>

        <LocalStorageNotice />

        {isLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500">読み込み中...</div>
        ) : hasRecord && !isEditing ? (
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <RecordSummary record={currentRecord!} photoUrl={photoUrl} onEdit={() => setIsEditing(true)} />
          </div>
        ) : (
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <DiaryForm
              date={selectedDate}
              record={currentRecord}
              photoUrl={photoUrl}
              onSaved={() => {
                setIsEditing(false);
                loadRecordForDate(selectedDate);
                loadRecordDates();
              }}
              onCancel={hasRecord ? () => setIsEditing(false) : undefined}
            />
          </div>
        )}

        <Link
          href="/weight"
          className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">体重の推移を見る</p>
            <p className="mt-0.5 text-xs text-gray-500">1週間・1ヶ月・1年のグラフを確認</p>
          </div>
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        selectedDate={selectedDate}
        recordDates={recordDates}
        onSelectDate={handleSelectDate}
        onClose={() => setIsCalendarOpen(false)}
      />
    </main>
  );
}
