"use client";

import { useAccessStore } from "@/lib/stores/accessStore";
import { useEnsureAccessInit } from "@/lib/hooks/useEnsureAccessInit";

export default function GuestTrialBadge() {
  useEnsureAccessInit();
  const mode = useAccessStore(s => s.mode);
  const daysRemaining = useAccessStore(s => s.daysRemaining);
  const isReadOnly = useAccessStore(s => s.isReadOnly);
  const initialized = useAccessStore(s => s.initialized);

  if (!initialized || mode !== "guest" || isReadOnly || daysRemaining === null || daysRemaining <= 0) {
    return null;
  }

  return (
    <span className="rounded-lg border border-primary/30 bg-sky-soft px-2 py-0.5 text-[10px] font-bold text-primary">
      あと{daysRemaining}日無料
    </span>
  );
}
