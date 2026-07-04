"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateSubmissionPayloadAction,
  type SubmissionReviewResult,
} from "@/lib/actions/adminSubmissions";
import {
  getFacilityPayloadValues,
  getParrotPayloadValues,
} from "@/lib/utils/submissionDisplay";
import type { Submission } from "@/types/submission";
import { adminInputClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import Button from "@/components/ui/Button";

const initialState: SubmissionReviewResult = {};

type SubmissionEditFormProps = {
  submission: Submission;
};

export default function SubmissionEditForm({ submission }: SubmissionEditFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateSubmissionPayloadAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (submission.type === "parrot_create") {
    const values = getParrotPayloadValues(submission.payload);

    return (
      <div
        className="border-t border-border pt-4"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => event.stopPropagation()}
      >
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">内容を編集</h3>
        <p className="mt-1 text-xs text-muted">承認前に内容を修正できます。生息地・説明などはここで追加してください。</p>

        <form action={formAction} className="mt-3 space-y-3">
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="submissionType" value={submission.type} />

          <div>
            <label htmlFor={`name-${submission.id}`} className={adminLabelClass}>
              名前
            </label>
            <input id={`name-${submission.id}`} name="name" defaultValue={values.name} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor={`habitat-${submission.id}`} className={adminLabelClass}>
              生息地
            </label>
            <input id={`habitat-${submission.id}`} name="habitat" defaultValue={values.habitat} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor={`description-${submission.id}`} className={adminLabelClass}>
              説明
            </label>
            <textarea
              id={`description-${submission.id}`}
              name="description"
              rows={5}
              defaultValue={values.description}
              className={`${adminInputClass} resize-y`}
            />
          </div>
          <div>
            <label htmlFor={`imageUrl-${submission.id}`} className={adminLabelClass}>
              画像URL
            </label>
            <input
              id={`imageUrl-${submission.id}`}
              name="imageUrl"
              type="url"
              defaultValue={values.imageUrl}
              className={adminInputClass}
            />
          </div>

          {state.error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{state.error}</p>}
          {state.success && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{state.success}</p>}

          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "保存中..." : "内容を保存"}
          </Button>
        </form>
      </div>
    );
  }

  if (submission.type === "facility_create") {
    const values = getFacilityPayloadValues(submission.payload);

    return (
      <div
        className="border-t border-border pt-4"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => event.stopPropagation()}
      >
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">内容を編集</h3>
        <p className="mt-1 text-xs text-muted">承認前に内容を修正できます。住所・サイト・鳥種などはここで追加してください。</p>

        <form action={formAction} className="mt-3 space-y-3">
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="submissionType" value={submission.type} />

          <div>
            <label htmlFor={`facility-name-${submission.id}`} className={adminLabelClass}>
              施設名
            </label>
            <input
              id={`facility-name-${submission.id}`}
              name="name"
              defaultValue={values.name}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor={`prefecture-${submission.id}`} className={adminLabelClass}>
              都道府県
            </label>
            <input
              id={`prefecture-${submission.id}`}
              name="prefecture"
              defaultValue={values.prefecture}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor={`address-${submission.id}`} className={adminLabelClass}>
              住所
            </label>
            <input id={`address-${submission.id}`} name="address" defaultValue={values.address} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor={`website-${submission.id}`} className={adminLabelClass}>
              ウェブサイト
            </label>
            <input
              id={`website-${submission.id}`}
              name="website"
              type="url"
              defaultValue={values.website}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor={`parrots-${submission.id}`} className={adminLabelClass}>
              飼育鳥種
            </label>
            <input
              id={`parrots-${submission.id}`}
              name="parrots"
              defaultValue={values.parrotsText}
              placeholder="例: セキセイインコ, オカメインコ"
              className={adminInputClass}
            />
            <p className="mt-1 text-xs text-muted">複数の場合はカンマ（,）で区切ってください。</p>
          </div>

          {state.error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{state.error}</p>}
          {state.success && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{state.success}</p>}

          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "保存中..." : "内容を保存"}
          </Button>
        </form>
      </div>
    );
  }

  return null;
}
