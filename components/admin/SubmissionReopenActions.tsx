"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  reopenSubmissionAction,
  type SubmissionReviewResult,
} from "@/lib/actions/adminSubmissions";
import Button from "@/components/ui/Button";

const initialState: SubmissionReviewResult = {};

type SubmissionReopenActionsProps = {
  submissionId: string;
};

export default function SubmissionReopenActions({ submissionId }: SubmissionReopenActionsProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(reopenSubmissionAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div
      className="border-t border-border pt-4"
      onClick={event => event.stopPropagation()}
      onKeyDown={event => event.stopPropagation()}
    >
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted">再審査</h3>
      <p className="mt-1 text-xs text-muted">却下した投稿を承認待ちに戻して、再度審査できます。</p>

      {state.error && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{state.error}</p>}
      {state.success && <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{state.success}</p>}

      <form action={formAction} className="mt-3">
        <input type="hidden" name="submissionId" value={submissionId} />
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "処理中..." : "承認待ちに戻す"}
        </Button>
      </form>
    </div>
  );
}
