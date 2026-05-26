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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
          aria-label="閉じる"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl">
          <div className="relative h-64 md:h-128 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-green-100">
            <img src={getParrotImageUrl(parrot.imageUrl)} alt={parrot.name} className="h-full w-full object-contain" />
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{parrot.name}</h2>
              <p className="text-sm italic text-gray-500">{parrot.scientificName}</p>
            </div>

            <div className="mb-4 flex items-center gap-2 text-sm">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-gray-700">生息地:</span>
              <span className="text-gray-600">{parrot.habitat}</span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">特徴・説明</h3>
              <p className="leading-relaxed text-gray-700">{parrot.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
