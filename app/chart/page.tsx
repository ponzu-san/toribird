"use client";

import { useEffect, useState } from "react";
import { useDiaryStore } from "@/lib/stores/diaryStore";
import type { WeightPeriod } from "@/types/diary";
import type { DailyRecord } from "@/types/diary";
import { computeMedianWeight } from "@/lib/utils/baseline";
import WeightChart from "@/components/diary/WeightChart";
import WeightPeriodSelector from "@/components/diary/WeightPeriodSelector";
import AccessBanner from "@/components/health/AccessBanner";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

function WeightSummary({ chartRecords, medianRecords }: { chartRecords: DailyRecord[]; medianRecords: DailyRecord[] }) {
  const chartWeights = chartRecords.filter(r => r.weightGrams !== undefined).map(r => r.weightGrams as number);
  if (chartWeights.length === 0) return null;

  const latest = chartWeights[chartWeights.length - 1];
  const median = computeMedianWeight(medianRecords);

  return (
    <Card padding="sm">
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="text-xs font-semibold text-muted">最新</p>
          <p className="font-display mt-1 text-xl font-bold text-primary">
            {latest}
            <span className="ml-0.5 text-sm font-semibold text-foreground">g</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">30日中央値</p>
          <p className="font-display mt-1 text-xl font-bold text-primary">
            {median ?? "—"}
            {median !== null && <span className="ml-0.5 text-sm font-semibold text-foreground">g</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function ChartPage() {
  const { weightRecords, weightPeriod, init, loadWeightRecords, setWeightPeriod } = useDiaryStore();
  const [medianRecords, setMedianRecords] = useState<DailyRecord[]>([]);

  useEffect(() => {
    init();
    loadWeightRecords(30);
  }, [init, loadWeightRecords]);

  useEffect(() => {
    if (weightPeriod === 30) {
      setMedianRecords(weightRecords);
    }
  }, [weightPeriod, weightRecords]);

  const handlePeriodChange = (period: WeightPeriod) => {
    setWeightPeriod(period);
    loadWeightRecords(period);
  };

  return (
    <PageShell width="narrow">
      <div className="space-y-4">
        <header className="mb-4 text-center">
          <p className="text-sm font-bold text-primary">グラフ</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">体重の推移</h1>
        </header>

        <AccessBanner />

        <WeightPeriodSelector selected={weightPeriod} onChange={handlePeriodChange} />

        <WeightSummary chartRecords={weightRecords} medianRecords={medianRecords} />

        <WeightChart records={weightRecords} period={weightPeriod} size="full" />
      </div>
    </PageShell>
  );
}
