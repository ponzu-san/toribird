import { submissionDisclaimer } from "@/lib/utils/submissionNotice";

export default function SubmissionNotice() {
  return (
    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
      {submissionDisclaimer}
    </p>
  );
}
