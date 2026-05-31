import { Feather } from "@/components/icons/BirdDecor";

export default function LocalStorageNotice() {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-border bg-sky-soft px-4 py-3">
      <Feather className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <p className="text-xs leading-relaxed text-muted">データはこの端末のみに保存されます。端末を変更すると記録は引き継がれません。</p>
    </div>
  );
}
