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
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";

export default function TodayPage() {
  const today = getTodayKey();
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { selectedDate, currentRecord, photoUrl, recordDates, isLoading, init, setSelectedDate, loadRecordForDate, loadRecordDates } = useDiaryStore();

  const isToday = selectedDate === today;

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    loadRecordForDate(selectedDate);
    setIsEditing(false);
  }, [selectedDate, loadRecordForDate]);

  const hasRecord = currentRecord && (currentRecord.weightGrams !== undefined || currentRecord.memo || currentRecord.photoId);

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
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-bold text-primary">日記</p>
              {isToday && (
                <span
                  className="flex h-6 w-8 shrink-0 flex-col items-center justify-center rounded-lg border border-fields/50 bg-fields text-[10px] font-bold leading-none text-foreground"
                  aria-label="今日"
                >
                  今日
                </span>
              )}
            </div>
            <Badge variant={hasRecord ? "success" : "muted"}>{hasRecord ? "記録済み" : "未記録"}</Badge>
          </div>
          <Card padding="sm">
            <DateNavigator selectedDate={selectedDate} onPrevDay={handlePrevDay} onNextDay={handleNextDay} onOpenCalendar={() => setIsCalendarOpen(true)} />
          </Card>
        </header>

        <LocalStorageNotice />

        {isLoading ? (
          <Card>
            <LoadingState />
          </Card>
        ) : hasRecord && !isEditing ? (
          <Card>
            <RecordSummary record={currentRecord!} photoUrl={photoUrl} onEdit={() => setIsEditing(true)} />
          </Card>
        ) : (
          <Card>
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
          </Card>
        )}

        <Link href="/weight" className="block">
          <Card hover className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">体重の推移を見る</p>
              <p className="mt-0.5 text-xs text-muted">1週間・1ヶ月・1年のグラフを確認</p>
            </div>
            <svg className="h-5 w-5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Card>
        </Link>
      </div>

      <CalendarModal isOpen={isCalendarOpen} selectedDate={selectedDate} recordDates={recordDates} onSelectDate={handleSelectDate} onClose={() => setIsCalendarOpen(false)} />
    </PageShell>
  );
}
