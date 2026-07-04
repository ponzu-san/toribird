"use client";

import Link from "next/link";
import { useAccessStore } from "@/lib/stores/accessStore";
import { useEnsureAccessInit } from "@/lib/hooks/useEnsureAccessInit";

export default function AccessBanner() {
  useEnsureAccessInit();
  const mode = useAccessStore(s => s.mode);
  const daysRemaining = useAccessStore(s => s.daysRemaining);
  const isReadOnly = useAccessStore(s => s.isReadOnly);
  const initialized = useAccessStore(s => s.initialized);

  if (!initialized || mode === "registered" || mode === "visitor") {
    return null;
  }

  if (mode === "guest" && !isReadOnly && daysRemaining !== null) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-sky-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          あと <span className="font-bold text-primary">{daysRemaining} 日間</span>
          無料でお使いいただけます。登録すると記録をクラウドに保存できます。
        </p>
        <Link href="/signup" className="shrink-0 text-xs font-semibold text-primary underline">
          無料登録
        </Link>
      </div>
    );
  }

  if (mode === "guest" && isReadOnly) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-amber-900">
          無料体験は終了しました。過去の記録は閲覧できます。記録を続けるには登録してください。
        </p>
        <Link href="/signup" className="shrink-0 text-xs font-semibold text-primary underline">
          無料登録
        </Link>
      </div>
    );
  }

  return null;
}
