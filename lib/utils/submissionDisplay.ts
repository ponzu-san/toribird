import type { Submission, SubmissionStatus, SubmissionType, ParrotSubmissionPayload, FacilitySubmissionPayload } from "@/types/submission";

export const submissionTypeLabels: Record<SubmissionType, string> = {
  parrot_create: "インコ（新規）",
  parrot_update: "インコ（更新）",
  facility_create: "施設（新規）",
  facility_update: "施設（更新）",
  facility_parrot_report: "施設の鳥情報",
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "却下",
};

export function getSubmissionTitle(submission: Submission): string {
  const name = submission.payload.name;
  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }
  return "（名称不明）";
}

export function getSubmissionSummary(submission: Submission): string {
  const { payload } = submission;

  if (submission.type.startsWith("parrot")) {
    const parts: string[] = [];
    if (typeof payload.habitat === "string" && payload.habitat) {
      parts.push(`生息地: ${payload.habitat}`);
    }
    return parts.join(" / ") || "—";
  }

  if (submission.type.startsWith("facility")) {
    const parts: string[] = [];
    if (typeof payload.prefecture === "string" && payload.prefecture) {
      parts.push(payload.prefecture);
    }
    if (Array.isArray(payload.parrots) && payload.parrots.length > 0) {
      parts.push(`鳥種 ${payload.parrots.length}件`);
    }
    return parts.join(" / ") || "—";
  }

  return "—";
}

export function formatSubmissionDate(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getParrotPayloadValues(payload: Record<string, unknown>): Required<Pick<ParrotSubmissionPayload, "name">> & ParrotSubmissionPayload {
  return {
    name: typeof payload.name === "string" ? payload.name : "",
    habitat: typeof payload.habitat === "string" ? payload.habitat : "",
    description: typeof payload.description === "string" ? payload.description : "",
    imageUrl: typeof payload.imageUrl === "string" ? payload.imageUrl : "",
  };
}

export function getFacilityPayloadValues(
  payload: Record<string, unknown>,
): Required<Pick<FacilitySubmissionPayload, "name" | "prefecture">> &
  FacilitySubmissionPayload & { parrotsText: string } {
  const parrots = Array.isArray(payload.parrots)
    ? payload.parrots.filter((item): item is string => typeof item === "string")
    : [];

  return {
    name: typeof payload.name === "string" ? payload.name : "",
    prefecture: typeof payload.prefecture === "string" ? payload.prefecture : "",
    address: typeof payload.address === "string" ? payload.address : "",
    website: typeof payload.website === "string" ? payload.website : "",
    parrots,
    parrotsText: parrots.join(", "),
  };
}

export function isEditableSubmissionType(type: SubmissionType): boolean {
  return type === "parrot_create" || type === "facility_create";
}

export type SubmissionDetailField = {
  label: string;
  value: string;
};

export type SubmissionDetailSection = {
  title: string;
  fields: SubmissionDetailField[];
};

function formatDetailValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join("、") : "—";
  }
  const text = String(value).trim();
  return text || "—";
}

function field(label: string, value: unknown): SubmissionDetailField {
  return { label, value: formatDetailValue(value) };
}

export function getSubmissionDetailSections(submission: Submission): SubmissionDetailSection[] {
  const { payload } = submission;
  const sections: SubmissionDetailSection[] = [];

  if (submission.type.startsWith("parrot")) {
    const fields = [field("名前", payload.name)];
    if (payload.habitat || payload.description || payload.imageUrl) {
      fields.push(
        field("生息地", payload.habitat),
        field("説明", payload.description),
        field("画像URL", payload.imageUrl),
      );
    }
    sections.push({ title: "インコ情報", fields });
  }

  if (submission.type.startsWith("facility")) {
    const fields = [
      field("施設名", payload.name),
      field("都道府県", payload.prefecture),
      field("住所", payload.address),
    ];
    if (payload.website || (Array.isArray(payload.parrots) && payload.parrots.length > 0)) {
      fields.push(field("ウェブサイト", payload.website), field("飼育鳥種", payload.parrots));
    }
    sections.push({ title: "施設情報", fields });
  }

  const submitterFields = [
    field("投稿者名", submission.submitterName),
    field("連絡先", submission.submitterContact),
    field("投稿者メモ", submission.submitterNote),
  ];
  if (submitterFields.some(item => item.value !== "—")) {
    sections.push({ title: "投稿者情報", fields: submitterFields });
  }

  if (submission.status !== "pending") {
    sections.push({
      title: "確認情報",
      fields: [
        field("ステータス", submissionStatusLabels[submission.status]),
        field("管理者メモ", submission.reviewerNote),
        field(
          "確認日時",
          submission.reviewedAt ? formatSubmissionDate(submission.reviewedAt) : null,
        ),
      ],
    });
  }

  sections.push({
    title: "メタ情報",
    fields: [
      field("投稿ID", submission.id),
      field("種別", submissionTypeLabels[submission.type]),
      field("対象ID", submission.targetId),
      field("投稿日時", formatSubmissionDate(submission.createdAt)),
    ],
  });

  return sections;
}
