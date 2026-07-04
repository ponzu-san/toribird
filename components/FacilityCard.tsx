import type { Facility } from "@/types/catalog";
import { sortJapanese } from "@/lib/utils/sortJa";
import Card from "@/components/ui/Card";

interface FacilityCardProps {
  facility: Facility;
  onParrotClick: (parrotName: string) => void;
}

export default function FacilityCard({ facility, onParrotClick }: FacilityCardProps) {
  return (
    <Card hover>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">{facility.name}</h3>
        <p className="mt-1 text-sm text-muted">{facility.prefecture}</p>
      </div>

      {facility.address && <p className="mb-5 text-sm leading-relaxed text-foreground">{facility.address}</p>}

      {facility.parrots.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold text-muted">見られるインコ</p>
          <div className="flex flex-wrap gap-2">
            {sortJapanese(facility.parrots).map(parrot => (
              <button
                key={parrot}
                onClick={() => onParrotClick(parrot)}
                className="rounded-full border border-border bg-sky-soft px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary hover:bg-sky-soft/70"
              >
                {parrot}
              </button>
            ))}
          </div>
        </div>
      )}

      {facility.website && (
        <a
          href={facility.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-primary transition hover:text-primary-dark"
        >
          公式サイト
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </Card>
  );
}
