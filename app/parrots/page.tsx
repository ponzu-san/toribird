"use client";

import { useState } from "react";
import { parrotDetails, ParrotDetail, getParrotImageUrl } from "@/data/parrots";
import ParrotModal from "@/components/ParrotModal";
import PageShell from "@/components/ui/PageShell";

export default function ParrotsPage() {
  const [selectedParrot, setSelectedParrot] = useState<ParrotDetail | null>(null);

  const parrots = Object.values(parrotDetails).sort((a, b) => a.name.localeCompare(b.name, "ja"));

  return (
    <PageShell width="wide" className="lg:pb-8">
      <header className="mb-4 text-center">
        <p className="text-sm font-bold text-primary">図鑑</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">インコ図鑑</h1>
        <p className="mt-2 text-muted">日本の施設で会えるインコ・オウムたちの詳細情報</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {parrots.map(parrot => (
          <button
            key={parrot.name}
            onClick={() => setSelectedParrot(parrot)}
            className="group overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left shadow-pop transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-pop-hover"
          >
            <div className="relative h-48 w-full overflow-hidden border-b border-border bg-sky-soft/60">
              <img src={getParrotImageUrl(parrot.imageUrl)} alt={parrot.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
            </div>

            <div className="p-5">
              <h3 className="mb-1 text-lg font-bold text-foreground">{parrot.name}</h3>
              <p className="font-display mb-3 text-xs text-muted">{parrot.englishName}</p>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="line-clamp-1">{parrot.habitat}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <ParrotModal parrot={selectedParrot} onClose={() => setSelectedParrot(null)} />
    </PageShell>
  );
}
