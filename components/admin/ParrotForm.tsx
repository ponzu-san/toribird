"use client";

import { useActionState } from "react";
import type { AdminParrot, CatalogStatus } from "@/types/catalog";
import { saveParrotAction, type ActionResult } from "@/lib/actions/adminCatalog";
import { adminInputClass, adminLabelClass, adminSelectClass } from "@/components/admin/adminFormStyles";
import Button from "@/components/ui/Button";

const statuses: CatalogStatus[] = ["draft", "published", "archived"];

const statusLabels: Record<CatalogStatus, string> = {
  draft: "下書き",
  published: "公開",
  archived: "アーカイブ",
};

type ParrotFormProps = {
  parrot?: AdminParrot;
};

export default function ParrotForm({ parrot }: ParrotFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(saveParrotAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {parrot && <input type="hidden" name="id" value={parrot.id} />}

      <div>
        <label htmlFor="name" className={adminLabelClass}>
          名前（日本語）
        </label>
        <input id="name" name="name" defaultValue={parrot?.name ?? ""} required className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="englishName" className={adminLabelClass}>
          英語名
        </label>
        <input id="englishName" name="englishName" defaultValue={parrot?.englishName ?? ""} required className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="habitat" className={adminLabelClass}>
          生息地
        </label>
        <input id="habitat" name="habitat" defaultValue={parrot?.habitat ?? ""} required className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="imageUrl" className={adminLabelClass}>
          画像URL
        </label>
        <input id="imageUrl" name="imageUrl" defaultValue={parrot?.imageUrl ?? ""} className={adminInputClass} />
      </div>

      <div>
        <label htmlFor="status" className={adminLabelClass}>
          公開状態
        </label>
        <select id="status" name="status" defaultValue={parrot?.status ?? "published"} className={adminSelectClass}>
          {statuses.map(status => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={adminLabelClass}>
          説明
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={parrot?.description ?? ""}
          required
          className={`resize-y ${adminInputClass}`}
        />
      </div>

      {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

      <Button type="submit" disabled={isPending} fullWidth>
        {isPending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
