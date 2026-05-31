"use client";

import { useMemo, useState } from "react";
import { facilities, allPrefectures, allParrotTypes } from "@/data/facilities";
import { parrotDetails } from "@/data/parrots";
import FacilityCard from "@/components/FacilityCard";
import SearchFilters from "@/components/SearchFilters";
import ParrotModal from "@/components/ParrotModal";
import PageShell from "@/components/ui/PageShell";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

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
    <PageShell width="wide" className="lg:pb-8">
      <header className="mb-4 text-center">
        <p className="text-sm font-bold text-primary">施設検索</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">インコが見られる施設</h1>
        <p className="mt-2 text-muted">日本全国のインコ・オウムに会える動物園や鳥カフェを探そう</p>
      </header>

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
          <p className="mb-4 text-sm text-muted">
            <span className="font-display font-bold text-foreground">{filteredFacilities.length}</span>件の施設が見つかりました
          </p>

          {filteredFacilities.length === 0 ? (
            <EmptyState title="条件に一致する施設が見つかりませんでした" description="都道府県やインコの種類を変えて、もう一度検索してみてください">
              <Button variant="primary" onClick={handleReset} className="mt-4">
                条件をリセット
              </Button>
            </EmptyState>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredFacilities.map(facility => (
                <FacilityCard key={facility.id} facility={facility} onParrotClick={handleParrotClick} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ParrotModal parrot={selectedParrotDetail ? parrotDetails[selectedParrotDetail] : null} onClose={handleCloseModal} />
    </PageShell>
  );
}
