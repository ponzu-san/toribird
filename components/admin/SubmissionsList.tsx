"use client";

import { Fragment, useState } from "react";
import type { Submission } from "@/types/submission";
import {
  formatSubmissionDate,
  getSubmissionDetailSections,
  getSubmissionSummary,
  getSubmissionTitle,
  isEditableSubmissionType,
  submissionStatusLabels,
  submissionTypeLabels,
} from "@/lib/utils/submissionDisplay";
import Card from "@/components/ui/Card";
import SubmissionEditForm from "@/components/admin/SubmissionEditForm";
import SubmissionReopenActions from "@/components/admin/SubmissionReopenActions";
import SubmissionReviewActions from "@/components/admin/SubmissionReviewActions";

type SubmissionsListProps = {
  submissions: Submission[];
};

export default function SubmissionsList({ submissions }: SubmissionsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(current => (current === id ? null : id));
  };

  return (
    <Card className="overflow-x-auto !p-0">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-sky-soft/40 text-muted">
          <tr>
            <th className="w-8 px-2 py-3" aria-hidden="true" />
            <th className="px-4 py-3 font-semibold">種別</th>
            <th className="px-4 py-3 font-semibold">内容</th>
            <th className="px-4 py-3 font-semibold">ステータス</th>
            <th className="px-4 py-3 font-semibold">投稿日時</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => {
            const isExpanded = expandedId === submission.id;
            const detailSections = getSubmissionDetailSections(submission);
            const showEditableForm =
              submission.status === "pending" && isEditableSubmissionType(submission.type);
            const readOnlySections = showEditableForm
              ? detailSections.filter(
                  section => section.title === "投稿者情報" || section.title === "メタ情報",
                )
              : detailSections;

            return (
              <Fragment key={submission.id}>
                <tr
                  className={`cursor-pointer border-b border-border transition hover:bg-sky-soft/30 ${
                    isExpanded ? "bg-sky-soft/20" : ""
                  }`}
                  onClick={() => toggle(submission.id)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggle(submission.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  aria-label={`${getSubmissionTitle(submission)}の詳細を${isExpanded ? "閉じる" : "表示"}`}
                >
                  <td className="px-2 py-3 text-center text-muted">
                    <span
                      className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      aria-hidden="true"
                    >
                      ▶
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{submissionTypeLabels[submission.type]}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{getSubmissionTitle(submission)}</p>
                    <p className="mt-1 text-xs text-muted">{getSubmissionSummary(submission)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        submission.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : submission.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {submissionStatusLabels[submission.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatSubmissionDate(submission.createdAt)}</td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-border bg-surface-elevated/60">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="space-y-4">
                        {readOnlySections.map(section => (
                          <section key={section.title}>
                            <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{section.title}</h3>
                            <dl className="mt-2 grid gap-3 sm:grid-cols-2">
                              {section.fields.map(item => (
                                <div key={`${section.title}-${item.label}`}>
                                  <dt className="text-xs font-semibold text-muted">{item.label}</dt>
                                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                                    {item.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </section>
                        ))}
                        {showEditableForm && <SubmissionEditForm submission={submission} />}
                        {submission.status === "pending" && (
                          <SubmissionReviewActions submissionId={submission.id} />
                        )}
                        {submission.status === "rejected" && (
                          <SubmissionReopenActions submissionId={submission.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
