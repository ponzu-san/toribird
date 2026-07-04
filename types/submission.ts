export type SubmissionType =
  | "parrot_create"
  | "parrot_update"
  | "facility_create"
  | "facility_update"
  | "facility_parrot_report";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  targetId: string | null;
  payload: Record<string, unknown>;
  submitterName: string | null;
  submitterContact: string | null;
  submitterNote: string | null;
  reviewerNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type ParrotSubmissionPayload = {
  name?: string;
  habitat?: string;
  description?: string;
  imageUrl?: string;
};

export type FacilitySubmissionPayload = {
  name?: string;
  prefecture?: string;
  address?: string;
  website?: string;
  parrots?: string[];
};
