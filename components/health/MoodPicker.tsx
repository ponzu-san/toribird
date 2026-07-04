"use client";

import type { Mood } from "@/types/health";
import { MOOD_OPTIONS } from "@/types/health";

interface MoodPickerProps {
  value?: Mood;
  onChange: (mood: Mood) => void;
  disabled?: boolean;
}

export default function MoodPicker({ value, onChange, disabled }: MoodPickerProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted">今日の調子</p>
      <div className="grid grid-cols-4 gap-2">
        {MOOD_OPTIONS.map(option => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-semibold transition-all ${
                isActive
                  ? "border-primary-dark bg-primary text-white shadow-pop"
                  : "border-border bg-surface-elevated text-muted hover:border-primary/40 hover:bg-sky-soft hover:text-foreground"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {option.emoji}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
