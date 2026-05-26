import { Facility } from "@/data/facilities";

interface FacilityCardProps {
  facility: Facility;
  onParrotClick: (parrotName: string) => void;
}

export default function FacilityCard({ facility, onParrotClick }: FacilityCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{facility.prefecture}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{facility.category}</span>
      </div>

      <p className="mb-4 text-sm text-gray-700">{facility.address}</p>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">見られるインコ</p>
        <div className="flex flex-wrap gap-2">
          {facility.parrots.map(parrot => (
            <button
              key={parrot}
              onClick={() => onParrotClick(parrot)}
              className="rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 transition hover:bg-green-100 hover:shadow-sm"
            >
              {parrot}
            </button>
          ))}
        </div>
      </div>

      <a
        href={facility.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-800"
      >
        公式サイト
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
