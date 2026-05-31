"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyRecord, WeightPeriod } from "@/types/diary";
import { formatShortDate } from "@/lib/utils/date";

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
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm text-gray-500">記録が増えるとグラフが表示されます</p>
        <p className="mt-1 text-xs text-gray-400">体重を2日分以上記録してみましょう</p>
      </div>
    );
  }

  const weights = chartData.map(d => d.weight as number);
  const minWeight = Math.floor(Math.min(...weights) - 5);
  const maxWeight = Math.ceil(Math.max(...weights) + 5);
  const chartHeight = size === "full" ? "h-72" : "h-48";
  const xInterval = getXAxisInterval(chartData.length, period);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">体重の推移（{PERIOD_LABELS[period]}）</h3>
      <div className={`w-full ${chartHeight}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval={xInterval}
            />
            <YAxis
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              width={40}
              tickFormatter={v => `${v}g`}
            />
            <Tooltip
              formatter={(value: number) => [`${value}g`, "体重"]}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload;
                return item?.date ?? "";
              }}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
