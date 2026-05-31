"use client";

import { useMemo, useState } from "react";
import { facilities, allPrefectures, allParrotTypes } from "@/data/facilities";
import { parrotDetails } from "@/data/parrots";
import FacilityCard from "@/components/FacilityCard";
import SearchFilters from "@/components/SearchFilters";
import ParrotModal from "@/components/ParrotModal";

export default function FacilitiesPage() {
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedParrot, setSelectedParrot] = useState("");
  const [selectedParrotDetail, setSelectedParrotDetail] = useState<string | null>(null);

  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => {
      const matchesPrefecture = selectedPrefecture === "" || facility.prefecture === selectedPrefecture;
      const matchesParrot = selectedParrot === "" || facility.parrots.includes(selectedParrot);

      return matchesPrefecture && matchesParrot;
    });
  }, [selectedPrefecture, selectedParrot]);

  const handleReset = () => {
    setSelectedPrefecture("");
    setSelectedParrot("");
  };

  const handleParrotClick = (parrotName: string) => {
    setSelectedParrotDetail(parrotName);
  };

  const handleCloseModal = () => {
    setSelectedParrotDetail(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">インコが見られる施設検索</h1>
          <p className="text-lg text-gray-600">日本全国のインコ・オウムに会える動物園や鳥カフェを探そう</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <aside>
            <SearchFilters
              selectedPrefecture={selectedPrefecture}
              selectedParrot={selectedParrot}
              prefectures={allPrefectures}
              parrotTypes={allParrotTypes}
              onPrefectureChange={setSelectedPrefecture}
              onParrotChange={setSelectedParrot}
              onReset={handleReset}
            />
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{filteredFacilities.length}件の施設が見つかりました</p>
            </div>

            {filteredFacilities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-gray-500">条件に一致する施設が見つかりませんでした。</p>
                <button onClick={handleReset} className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                  条件をリセット
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredFacilities.map(facility => (
                  <FacilityCard key={facility.id} facility={facility} onParrotClick={handleParrotClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ParrotModal parrot={selectedParrotDetail ? parrotDetails[selectedParrotDetail] : null} onClose={handleCloseModal} />
    </main>
  );
}
