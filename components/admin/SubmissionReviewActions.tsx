"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
  type SubmissionReviewResult,
} from "@/lib/actions/adminSubmissions";
import { adminInputClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import Button from "@/components/ui/Button";

const initialState: SubmissionReviewResult = {};

type SubmissionReviewActionsProps = {
  submissionId: string;
};

export default function SubmissionReviewActions({ submissionId }: SubmissionReviewActionsProps) {
  const router = useRouter();
  const [approveState, approveAction, isApproving] = useActionState(approveSubmissionAction, initialState);
  const [rejectState, rejectAction, isRejecting] = useActionState(rejectSubmissionAction, initialState);

  const isPending = isApproving || isRejecting;
  const message = approveState.success ?? rejectState.success ?? approveState.error ?? rejectState.error;
  const isError = Boolean(approveState.error ?? rejectState.error);

  useEffect(() => {
    if (approveState.success || rejectState.success) {
      router.refresh();
    }
  }, [approveState.success, rejectState.success, router]);

  return (
    <div
      className="border-t border-border pt-4"
      onClick={event => event.stopPropagation()}
      onKeyDown={event => event.stopPropagation()}
    >
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted">審査</h3>

      {message && (
        <p
          className={`mt-2 rounded-xl px-3 py-2 text-sm ${
            isError ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"
          }`}
          role="status"
        >
          {message}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
        <form action={approveAction} className="sm:shrink-0">
          <input type="hidden" name="submissionId" value={submissionId} />
          <Button type="submit" disabled={isPending} className="!bg-emerald-600 hover:!bg-emerald-700">
            {isApproving ? "承認中..." : "承認する"}
          </Button>
        </form>

        <form action={rejectAction} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
          <input type="hidden" name="submissionId" value={submissionId} />
          <div className="flex-1">
            <label htmlFor={`reviewer-note-${submissionId}`} className={adminLabelClass}>
              却下理由（任意）
            </label>
            <input
              id={`reviewer-note-${submissionId}`}
              name="reviewerNote"
              type="text"
              placeholder="例: 情報が不足しています"
              className={adminInputClass}
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            disabled={isPending}
            className="!border-rose-300 !text-rose-700 hover:!border-rose-400"
          >
            {isRejecting ? "却下中..." : "却下する"}
          </Button>
        </form>
      </div>
    </div>
  );
}
