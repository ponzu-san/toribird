"use client";

import { useState, useTransition } from "react";
import { devSwitchGuest, devSwitchPlan, devSwitchToRegistered } from "@/lib/actions/devAccess";
import { useAccessStore } from "@/lib/stores/accessStore";
import type { GuestPreset } from "@/lib/dev/guestPresets";
import { guestPresetLabel } from "@/lib/dev/guestPresets";
import type { SubscriptionPlan } from "@/types/health";

const GUEST_PRESETS: GuestPreset[] = ["active", "last_day", "expired"];

function formatMode(mode: string | null): string {
  switch (mode) {
    case "guest":
      return "ゲスト";
    case "registered":
      return "登録済み";
    case "visitor":
      return "未体験";
    default:
      return "—";
  }
}

export default function DevAccessPanel() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const mode = useAccessStore(s => s.mode);
  const plan = useAccessStore(s => s.plan);
  const daysRemaining = useAccessStore(s => s.daysRemaining);
  const isReadOnly = useAccessStore(s => s.isReadOnly);
  const initialized = useAccessStore(s => s.initialized);

  const isRegistered = mode === "registered";

  const runDevAction = (fn: () => Promise<{ ok?: true; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) {
        setError(result.error);
        return;
      }
      window.location.assign("/");
    });
  };

  const handleGuestSwitch = (preset: GuestPreset) => {
    runDevAction(() => devSwitchGuest(preset));
  };

  const handlePlanSwitch = (planValue: SubscriptionPlan) => {
    if (isRegistered) {
      runDevAction(() => devSwitchPlan(planValue));
    } else {
      runDevAction(() => devSwitchToRegistered(planValue));
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 font-sans text-xs">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-amber-400 bg-amber-100 px-3 py-1.5 font-bold text-amber-900 shadow-md"
        >
          DEV
        </button>
      ) : (
        <div className="w-56 rounded-2xl border border-amber-300 bg-amber-50 p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold text-amber-900">開発用状態切替</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-amber-700 hover:text-amber-900"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>

          {initialized && (
            <div className="mb-3 space-y-0.5 rounded-lg bg-white/60 px-2 py-1.5 text-[10px] text-amber-950">
              <p>
                状態: <span className="font-semibold">{formatMode(mode)}</span>
                {mode === "guest" && daysRemaining !== null && `（残${daysRemaining}日）`}
                {isReadOnly && " · 閲覧のみ"}
              </p>
              {isRegistered && (
                <p>
                  プラン: <span className="font-semibold">{plan === "plus" ? "Plus" : "Free"}</span>
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-amber-800">ゲスト</p>
            {GUEST_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                disabled={pending}
                onClick={() => handleGuestSwitch(preset)}
                className="w-full rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-left text-[11px] font-medium text-amber-950 hover:bg-amber-100 disabled:opacity-50"
              >
                {guestPresetLabel(preset)}
              </button>
            ))}

            <p className="pt-1 text-[10px] font-semibold text-amber-800">登録ユーザー</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={pending}
                onClick={() => handlePlanSwitch("free")}
                className="flex-1 rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-[11px] font-medium text-amber-950 hover:bg-amber-100 disabled:opacity-50"
              >
                Free
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => handlePlanSwitch("plus")}
                className="flex-1 rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-[11px] font-medium text-amber-950 hover:bg-amber-100 disabled:opacity-50"
              >
                Plus
              </button>
            </div>
          </div>

          {error && <p className="mt-2 text-[10px] text-red-600">{error}</p>}
          {pending && <p className="mt-2 text-[10px] text-amber-700">切り替え中…</p>}
        </div>
      )}
    </div>
  );
}
