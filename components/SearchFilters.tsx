interface SearchFiltersProps {
  selectedPrefecture: string;
  selectedParrot: string;
  prefectures: string[];
  parrotTypes: string[];
  onPrefectureChange: (prefecture: string) => void;
  onParrotChange: (parrot: string) => void;
  onReset: () => void;
}

export default function SearchFilters({
  selectedPrefecture,
  selectedParrot,
  prefectures,
  parrotTypes,
  onPrefectureChange,
  onParrotChange,
  onReset,
}: SearchFiltersProps) {
  const hasActiveFilters = selectedPrefecture !== "" || selectedParrot !== "";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">検索条件</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="prefecture" className="mb-2 block text-sm font-medium text-gray-700">
            都道府県
          </label>
          <select
            id="prefecture"
            value={selectedPrefecture}
            onChange={e => onPrefectureChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全ての都道府県</option>
            {prefectures.map(pref => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="parrot" className="mb-2 block text-sm font-medium text-gray-700">
            インコの種類
          </label>
          <select
            id="parrot"
            value={selectedParrot}
            onChange={e => onParrotChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全ての種類</option>
            {parrotTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            条件をリセット
          </button>
        )}
      </div>
    </div>
  );
}
