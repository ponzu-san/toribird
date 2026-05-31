import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const selectClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

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
    <Card>
      <h2 className="mb-5 text-lg font-bold text-foreground">検索条件</h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="prefecture" className="mb-2 block text-sm font-semibold text-muted">
            都道府県
          </label>
          <select id="prefecture" value={selectedPrefecture} onChange={e => onPrefectureChange(e.target.value)} className={selectClass}>
            <option value="">全ての都道府県</option>
            {prefectures.map(pref => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="parrot" className="mb-2 block text-sm font-semibold text-muted">
            インコの種類
          </label>
          <select id="parrot" value={selectedParrot} onChange={e => onParrotChange(e.target.value)} className={selectClass}>
            <option value="">全ての種類</option>
            {parrotTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button variant="secondary" fullWidth onClick={onReset}>
            条件をリセット
          </Button>
        )}
      </div>
    </Card>
  );
}
