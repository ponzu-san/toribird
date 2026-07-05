"use client";

import { useEffect, type ReactNode } from "react";
import type { InstallGuideKey } from "@/lib/hooks/usePwaInstall";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideKey: InstallGuideKey;
}

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

function ChevronDownIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

type GuideStep = { icon: ReactNode; text: string };

const GUIDE_CONTENT: Record<InstallGuideKey, { title: string; steps: GuideStep[]; note?: string }> = {
  iosSafari: {
    title: "iPhone（Safari）での追加方法",
    steps: [
      { icon: <DotsVerticalIcon />, text: "画面右下の「…」をタップ" },
      { icon: <ShareIcon />, text: "「共有」ボタン（□に↑）をタップ" },
      { icon: <ChevronDownIcon />, text: "「∨ 表示を増やす」をタップ" },
      { icon: <PlusSquareIcon />, text: "「ホーム画面に追加」をタップ" },
      { icon: <CheckIcon />, text: "右上の「追加」をタップ" },
    ],
    note: "iOS のバージョンや設定によって表示が異なる場合があります",
  },
  iosChrome: {
    title: "iPhone（Chrome）での追加方法",
    steps: [
      { icon: <ShareIcon />, text: "画面右上の「共有」ボタン（□に↑）をタップ" },
      { icon: <ChevronDownIcon />, text: "「表示を増やす」をタップ" },
      { icon: <PlusSquareIcon />, text: "「ホーム画面に追加」をタップ" },
      { icon: <CheckIcon />, text: "「追加」をタップ" },
    ],
    note: "iOS のバージョンや設定によって表示が異なる場合があります",
  },
  androidManual: {
    title: "Android での追加方法",
    steps: [
      { icon: <DotsVerticalIcon />, text: "右上の「⋮」（メニュー）をタップ" },
      { icon: <PlusSquareIcon />, text: "「アプリをインストール」または「ホーム画面に追加」をタップ" },
      { icon: <CheckIcon />, text: "「インストール」をタップ" },
    ],
  },
};

function StepList({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-sky-soft text-primary">
            {step.icon}
          </span>
          <p className="pt-2 text-sm leading-relaxed text-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function InstallGuideModal({ isOpen, onClose, guideKey }: InstallGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  const content = GUIDE_CONTENT[guideKey];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />

      <div
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-surface-elevated shadow-pop-hover"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-3">
          <h2 className="text-lg font-bold text-foreground">{content.title}</h2>
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

        <div className="p-4">
          <StepList steps={content.steps} />
          {content.note && <p className="mt-4 text-xs text-muted">{content.note}</p>}
        </div>
      </div>
    </div>
  );
}
