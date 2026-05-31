"use client";

import { useEffect } from "react";
import { useDiaryStore } from "@/lib/stores/diaryStore";
import type { WeightPeriod } from "@/types/diary";
import WeightChart from "@/components/diary/WeightChart";
import WeightPeriodSelector from "@/components/diary/WeightPeriodSelector";
import LocalStorageNotice from "@/components/diary/LocalStorageNotice";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

function WeightSummary({ records }: { records: { weightGrams?: number; date: string }[] }) {
  const weights = records.map(r => r.weightGrams as number);
  if (weights.length === 0) return null;

  const latest = weights[weights.length - 1];
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  return (
    <Card padding="sm">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs font-semibold text-muted">最新</p>
          <p className="font-display mt-1 text-xl font-bold text-primary">
            {latest}
            <span className="ml-0.5 text-sm font-semibold text-foreground">g</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">最小</p>
          <p className="font-display mt-1 text-xl font-bold text-primary">
            {min}
            <span className="ml-0.5 text-sm font-semibold text-foreground">g</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">最大</p>
          <p className="font-display mt-1 text-xl font-bold text-primary">
            {max}
            <span className="ml-0.5 text-sm font-semibold text-foreground">g</span>
          </p>
        </div>
      </div>
    </Card>
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
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <p className="text-sm font-bold text-primary">体重</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">体重の推移</h1>
        </header>

        <LocalStorageNotice />

        <WeightPeriodSelector selected={weightPeriod} onChange={handlePeriodChange} />

        <WeightSummary records={weightRecords} />

        <WeightChart records={weightRecords} period={weightPeriod} size="full" />
      </div>
    </PageShell>
  );
}
