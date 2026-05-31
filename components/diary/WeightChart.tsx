"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyRecord, WeightPeriod } from "@/types/diary";
import { formatShortDate } from "@/lib/utils/date";
import EmptyState from "@/components/ui/EmptyState";

interface WeightChartProps {
  records: DailyRecord[];
  period: WeightPeriod;
  size?: "compact" | "full";
}

const PERIOD_LABELS: Record<WeightPeriod, string> = {
  7: "直近1週間",
  30: "直近1ヶ月",
  365: "直近1年",
  all: "全期間",
};

const CHART_PRIMARY = "#1785e4";

function getXAxisInterval(dataLength: number, period: WeightPeriod): number | "preserveStartEnd" {
  if (dataLength <= 7) return 0;
  if (period === 7) return 0;
  if (period === 30) return Math.max(0, Math.floor(dataLength / 6) - 1);
  return "preserveStartEnd";
}

export default function WeightChart({ records, period, size = "compact" }: WeightChartProps) {
  const chartData = useMemo(() => {
    return records
      .filter(r => r.weightGrams !== undefined)
      .map(r => ({
        date: r.date,
        label: formatShortDate(r.date),
        weight: r.weightGrams,
      }));
  }, [records]);

  if (chartData.length < 2) {
    return (
      <EmptyState
        title="記録が増えるとグラフが表示されます"
        description="体重を2日分以上記録してみましょう"
      />
    );
  }

  const weights = chartData.map(d => d.weight as number);
  const minWeight = Math.floor(Math.min(...weights) - 5);
  const maxWeight = Math.ceil(Math.max(...weights) + 5);
  const xInterval = getXAxisInterval(chartData.length, period);

  const heightClass = size === "full" ? "h-64 lg:h-72" : "h-48";

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-pop">
      <h3 className="mb-3 text-sm font-bold text-foreground">体重の推移（{PERIOD_LABELS[period]}）</h3>
      <div className={`w-full ${heightClass}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e6e4" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#5c6b7a" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e6e4" }}
              interval={xInterval}
            />
            <YAxis
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 11, fill: "#5c6b7a" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e6e4" }}
              width={40}
              tickFormatter={v => `${v}g`}
            />
            <Tooltip
              formatter={(value: number) => [`${value}g`, "体重"]}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload;
                return item?.date ?? "";
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e6e4",
                fontSize: "12px",
                boxShadow: "var(--shadow-pop)",
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke={CHART_PRIMARY}
              strokeWidth={2.5}
              dot={{ r: 4, fill: CHART_PRIMARY }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
