import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Submission, SubmissionStatus } from "@/types/submission";

type SubmissionRow = {
  id: string;
  type: Submission["type"];
  status: SubmissionStatus;
  target_id: string | null;
  payload: Record<string, unknown>;
  submitter_name: string | null;
  submitter_contact: string | null;
  submitter_note: string | null;
  reviewer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

function mapSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    targetId: row.target_id,
    payload: row.payload ?? {},
    submitterName: row.submitter_name,
    submitterContact: row.submitter_contact,
    submitterNote: row.submitter_note,
    reviewerNote: row.reviewer_note,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

async function getClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase が設定されていません");
  }
  return supabase;
}

export async function getAdminSubmissions(status?: SubmissionStatus): Promise<Submission[]> {
  const supabase = await getClient();

  let query = supabase
    .from("submissions")
    .select(
      "id, type, status, target_id, payload, submitter_name, submitter_contact, submitter_note, reviewer_note, reviewed_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(row => mapSubmission(row as SubmissionRow));
}

export async function getPendingSubmissionCount(): Promise<number> {
  const supabase = await getClient();

  const { count, error } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
