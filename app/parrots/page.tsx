"use client";

import { useState } from "react";
import { parrotDetails, ParrotDetail, getParrotImageUrl } from "@/data/parrots";
import ParrotModal from "@/components/ParrotModal";

export default function ParrotsPage() {
  const [selectedParrot, setSelectedParrot] = useState<ParrotDetail | null>(null);

  const parrots = Object.values(parrotDetails);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">インコ図鑑</h1>
          <p className="text-lg text-gray-600">日本の施設で会えるインコ・オウムたちの詳細情報</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {parrots.map(parrot => (
            <button
              key={parrot.name}
              onClick={() => setSelectedParrot(parrot)}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-green-100">
                <img src={getParrotImageUrl(parrot.imageUrl)} alt={parrot.name} className="h-full w-full object-cover transition group-hover:scale-110" />
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{parrot.name}</h3>
                <p className="mb-2 text-xs italic text-gray-500">{parrot.scientificName}</p>

                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <ParrotModal parrot={selectedParrot} onClose={() => setSelectedParrot(null)} />
    </main>
  );
}
