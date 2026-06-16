"use client";

import { useActionState } from "react";
import type { AdminFacility, CatalogStatus } from "@/types/catalog";
import { saveFacilityAction, type ActionResult } from "@/lib/actions/adminCatalog";
import { adminInputClass, adminLabelClass, adminSelectClass } from "@/components/admin/adminFormStyles";
import Button from "@/components/ui/Button";

const statuses: CatalogStatus[] = ["draft", "published", "archived"];

const statusLabels: Record<CatalogStatus, string> = {
  draft: "下書き",
  published: "公開",
  archived: "アーカイブ",
};

type FacilityFormProps = {
  facility?: AdminFacility;
  parrotOptions: Array<{ id: string; name: string }>;
};

export default function FacilityForm({ facility, parrotOptions }: FacilityFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(saveFacilityAction, {});
  const selectedIds = new Set(facility?.parrotIds ?? []);

  return (
    <form action={formAction} className="space-y-4">
      {facility && <input type="hidden" name="id" value={facility.id} />}

      <div>
        <label htmlFor="name" className={adminLabelClass}>
          施設名
        </label>
        <input id="name" name="name" defaultValue={facility?.name ?? ""} required className={adminInputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prefecture" className={adminLabelClass}>
            都道府県
          </label>
          <input id="prefecture" name="prefecture" defaultValue={facility?.prefecture ?? ""} required className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="category" className={adminLabelClass}>
            カテゴリ
          </label>
          <input
            id="category"
            name="category"
            defaultValue={facility?.category ?? ""}
            placeholder="例: 動物園、鳥カフェ"
            required
            className={adminInputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={adminLabelClass}>
          住所
        </label>
        <input id="address" name="address" defaultValue={facility?.address ?? ""} required className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="website" className={adminLabelClass}>
          公式サイトURL
        </label>
        <input id="website" name="website" type="url" defaultValue={facility?.website ?? ""} className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="status" className={adminLabelClass}>
          公開状態
        </label>
        <select id="status" name="status" defaultValue={facility?.status ?? "published"} className={adminSelectClass}>
          {statuses.map(status => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className={adminLabelClass}>見られるインコ</p>
        <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-4">
          {parrotOptions.length === 0 ? (
            <p className="text-sm text-muted">先に図鑑へ鳥種を登録してください</p>
          ) : (
            parrotOptions.map(parrot => (
              <label key={parrot.id} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="parrotIds" value={parrot.id} defaultChecked={selectedIds.has(parrot.id)} className="h-4 w-4 rounded border-border" />
                {parrot.name}
              </label>
            ))
          )}
        </div>
      </div>

      {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

      <Button type="submit" disabled={isPending} fullWidth>
        {isPending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
