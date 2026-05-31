"use client";

import { useEffect } from "react";
import { ParrotDetail, getParrotImageUrl } from "@/data/parrots";

interface ParrotModalProps {
  parrot: ParrotDetail | null;
  onClose: () => void;
}

export default function ParrotModal({ parrot, onClose }: ParrotModalProps) {
  useEffect(() => {
    if (parrot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [parrot]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (parrot) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [parrot, onClose]);

  if (!parrot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-surface-elevated shadow-pop-hover" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted shadow-pop transition hover:border-primary hover:bg-sky-soft hover:text-primary"
          aria-label="閉じる"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-64 w-full overflow-hidden border-b border-border bg-sky-soft/60 md:h-80">
          <img src={getParrotImageUrl(parrot.imageUrl)} alt={parrot.name} className="h-full w-full object-contain" />
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-5">
            <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">{parrot.name}</h2>
            <p className="font-display text-sm text-muted">{parrot.englishName}</p>
          </div>

          <div className="mb-5 flex items-center gap-2 text-sm text-foreground">
            <svg className="h-5 w-5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">生息地:</span>
            <span>{parrot.habitat}</span>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">特徴・説明</h3>
            <p className="leading-relaxed text-foreground">{parrot.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
