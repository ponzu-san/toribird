"use client";

import type { WeightPeriod } from "@/types/diary";

const PERIODS: { value: WeightPeriod; label: string }[] = [
  { value: 7, label: "1週間" },
  { value: 30, label: "1ヶ月" },
  { value: 365, label: "1年" },
  { value: "all", label: "全期間" },
];

interface WeightPeriodSelectorProps {
  selected: WeightPeriod;
  onChange: (period: WeightPeriod) => void;
}

export default function WeightPeriodSelector({ selected, onChange }: WeightPeriodSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-xl bg-gray-100 p-1">
      {PERIODS.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={String(value)}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-lg py-2 text-xs font-medium transition sm:text-sm ${
              isActive ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
