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
    <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-border bg-surface p-1.5">
      {PERIODS.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={String(value)}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-xl py-2.5 text-xs font-semibold transition-all sm:text-sm ${
              isActive
                ? "border border-primary-dark bg-primary text-white shadow-pop"
                : "border border-transparent text-muted hover:border-border hover:bg-sky-soft hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
