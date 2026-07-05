"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { InstallPlatform } from "@/lib/hooks/usePwaInstall";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: InstallPlatform;
}

type GuideTab = "ios" | "android";

function ShareIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0L8 8m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v8m-4-4h8M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
      />
    </svg>
  );
}

function DotsVerticalIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const STEPS: Record<GuideTab, { icon: ReactNode; text: string }[]> = {
  ios: [
    { icon: <ShareIcon />, text: "画面下部（PC版は上部アドレスバー横）の「共有」ボタンをタップ" },
    { icon: <PlusSquareIcon />, text: "メニューを下にスクロールし「ホーム画面に追加」をタップ" },
    { icon: <CheckIcon />, text: "右上の「追加」をタップすると完了です" },
  ],
  android: [
    { icon: <DotsVerticalIcon />, text: "右上の「⋮」（メニュー）をタップ" },
    { icon: <PlusSquareIcon />, text: "「アプリをインストール」または「ホーム画面に追加」をタップ" },
    { icon: <CheckIcon />, text: "「インストール」をタップすると完了です" },
  ],
};

export default function InstallGuideModal({ isOpen, onClose, defaultTab = "ios" }: InstallGuideModalProps) {
  const [tab, setTab] = useState<GuideTab>(defaultTab === "android" ? "android" : "ios");

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab === "android" ? "android" : "ios");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultTab]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />

      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-pop-hover"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-bold text-foreground">ホーム画面への追加方法</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-primary hover:bg-sky-soft hover:text-primary"
            aria-label="閉じる"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 px-4 pt-4">
          <button
            type="button"
            onClick={() => setTab("ios")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tab === "ios" ? "bg-primary text-white shadow-pop" : "border border-border text-muted hover:bg-sky-soft"
            }`}
          >
            iPhone（Safari）
          </button>
          <button
            type="button"
            onClick={() => setTab("android")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tab === "android" ? "bg-primary text-white shadow-pop" : "border border-border text-muted hover:bg-sky-soft"
            }`}
          >
            Android（Chrome）
          </button>
        </div>

        <ol className="space-y-4 p-4">
          {STEPS[tab].map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-sky-soft text-primary">
                {step.icon}
              </span>
              <p className="pt-2 text-sm leading-relaxed text-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
