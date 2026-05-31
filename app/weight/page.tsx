"use client";

import { useEffect } from "react";
import { useDiaryStore } from "@/lib/stores/diaryStore";
import type { WeightPeriod } from "@/types/diary";
import WeightChart from "@/components/diary/WeightChart";
import WeightPeriodSelector from "@/components/diary/WeightPeriodSelector";
import LocalStorageNotice from "@/components/diary/LocalStorageNotice";

function WeightSummary({ records }: { records: { weightGrams?: number; date: string }[] }) {
  const weights = records.map(r => r.weightGrams as number);
  if (weights.length === 0) return null;

  const latest = weights[weights.length - 1];
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-500">最新</p>
          <p className="text-lg font-bold text-blue-900">
            {latest}
            <span className="ml-0.5 text-sm font-medium">g</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">最小</p>
          <p className="text-lg font-bold text-gray-800">
            {min}
            <span className="ml-0.5 text-sm font-medium">g</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">最大</p>
          <p className="text-lg font-bold text-gray-800">
            {max}
            <span className="ml-0.5 text-sm font-medium">g</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WeightPage() {
  const { weightRecords, weightPeriod, init, loadWeightRecords, setWeightPeriod } = useDiaryStore();

  useEffect(() => {
    init();
    loadWeightRecords(30);
  }, [init, loadWeightRecords]);

  const handlePeriodChange = (period: WeightPeriod) => {
    setWeightPeriod(period);
    loadWeightRecords(period);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-24 lg:pb-8">
      <div className="mx-auto max-w-lg px-4 py-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-blue-600">体重</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">体重の推移</h1>
        </header>

        <LocalStorageNotice />

        <div className="mb-4">
          <WeightPeriodSelector selected={weightPeriod} onChange={handlePeriodChange} />
        </div>

        <WeightSummary records={weightRecords} />

        <div className="mt-4">
          <WeightChart records={weightRecords} period={weightPeriod} size="full" />
        </div>
      </div>
    </main>
  );
}
