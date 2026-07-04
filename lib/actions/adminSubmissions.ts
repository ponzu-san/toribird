"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  FacilitySubmissionPayload,
  ParrotSubmissionPayload,
  SubmissionStatus,
  SubmissionType,
} from "@/types/submission";

export type SubmissionReviewResult = {
  error?: string;
  success?: string;
};

type SubmissionRow = {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  payload: Record<string, unknown>;
};

async function getAuthedClient() {
  const session = await requireAdminSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase が設定されていません");
  }
  return { supabase, session };
}

function revalidateSubmissionPaths() {
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  revalidatePath("/parrots");
  revalidatePath("/facilities");
  revalidatePath("/admin/parrots");
  revalidatePath("/admin/facilities");
}

const PLACEHOLDER_HABITAT = "（未登録）";
const PLACEHOLDER_DESCRIPTION = "（未登録）";

function parseParrotPayload(payload: Record<string, unknown>): ParrotSubmissionPayload {
  return {
    name: typeof payload.name === "string" ? payload.name.trim() : "",
    habitat: typeof payload.habitat === "string" ? payload.habitat.trim() : "",
    description: typeof payload.description === "string" ? payload.description.trim() : "",
    imageUrl: typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "",
  };
}

function parseFacilityPayload(payload: Record<string, unknown>): FacilitySubmissionPayload {
  const parrots = Array.isArray(payload.parrots)
    ? payload.parrots
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];

  return {
    name: typeof payload.name === "string" ? payload.name.trim() : "",
    prefecture: typeof payload.prefecture === "string" ? payload.prefecture.trim() : "",
    address: typeof payload.address === "string" ? payload.address.trim() : "",
    website: typeof payload.website === "string" ? payload.website.trim() : "",
    parrots,
  };
}

async function fetchPendingSubmission(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  submissionId: string,
): Promise<{ submission?: SubmissionRow; error?: string }> {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, status, payload")
    .eq("id", submissionId)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "投稿が見つかりません" };
  }

  if (data.status === "approved") {
    return { error: "既に承認済みです" };
  }

  if (data.status === "rejected") {
    return { error: "既に却下済みです" };
  }

  if (data.status !== "pending") {
    return { error: "この投稿は処理できません" };
  }

  return { submission: data as SubmissionRow };
}

async function markSubmissionRejected(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  submissionId: string,
  reviewerId: string,
  reviewerNote: string,
): Promise<{ error?: string }> {
  const { data, error } = await supabase
    .from("submissions")
    .update({
      status: "rejected",
      reviewer_note: reviewerNote,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "既に処理済みです" };
  }

  revalidateSubmissionPaths();
  return {};
}

async function markSubmissionApproved(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  submissionId: string,
  reviewerId: string,
  targetId: string,
): Promise<SubmissionReviewResult> {
  const { data, error } = await supabase
    .from("submissions")
    .update({
      status: "approved",
      target_id: targetId,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "既に処理済みです" };
  }

  revalidateSubmissionPaths();
  return { success: "承認しました" };
}

async function approveParrotCreate(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  submission: SubmissionRow,
  reviewerId: string,
): Promise<SubmissionReviewResult> {
  const payload = parseParrotPayload(submission.payload);

  if (!payload.name) {
    const rejectResult = await markSubmissionRejected(
      supabase,
      submission.id,
      reviewerId,
      "名前が入力されていないため却下しました",
    );
    if (rejectResult.error) {
      return rejectResult;
    }
    return { success: "名前が入力されていないため却下しました" };
  }

  const { data: existing } = await supabase.from("parrots").select("id").eq("name", payload.name).maybeSingle();

  if (existing) {
    const note = `同名の鳥種「${payload.name}」が既に存在するため却下しました`;
    const rejectResult = await markSubmissionRejected(supabase, submission.id, reviewerId, note);
    if (rejectResult.error) {
      return rejectResult;
    }
    return { success: note };
  }

  const { data: created, error } = await supabase
    .from("parrots")
    .insert({
      name: payload.name,
      habitat: payload.habitat || PLACEHOLDER_HABITAT,
      description: payload.description || PLACEHOLDER_DESCRIPTION,
      image_url: payload.imageUrl || null,
      status: "published",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const note = `同名の鳥種「${payload.name}」が既に存在するため却下しました`;
      const rejectResult = await markSubmissionRejected(supabase, submission.id, reviewerId, note);
      if (rejectResult.error) {
        return rejectResult;
      }
      return { success: note };
    }
    return { error: error.message };
  }

  return markSubmissionApproved(supabase, submission.id, reviewerId, created.id);
}

async function approveFacilityCreate(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  submission: SubmissionRow,
  reviewerId: string,
): Promise<SubmissionReviewResult> {
  const payload = parseFacilityPayload(submission.payload);

  if (!payload.name || !payload.prefecture) {
    const rejectResult = await markSubmissionRejected(
      supabase,
      submission.id,
      reviewerId,
      "施設名または都道府県が不足しているため却下しました",
    );
    if (rejectResult.error) {
      return rejectResult;
    }
    return { success: "施設名または都道府県が不足しているため却下しました" };
  }

  const { count } = await supabase
    .from("facilities")
    .select("id", { count: "exact", head: true })
    .eq("name", payload.name);

  if ((count ?? 0) > 0) {
    const note = `同名の施設「${payload.name}」が既に存在するため却下しました`;
    const rejectResult = await markSubmissionRejected(supabase, submission.id, reviewerId, note);
    if (rejectResult.error) {
      return rejectResult;
    }
    return { success: note };
  }

  const { data: created, error } = await supabase
    .from("facilities")
    .insert({
      name: payload.name,
      prefecture: payload.prefecture,
      address: payload.address || null,
      website: payload.website || null,
      status: "published",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (payload.parrots && payload.parrots.length > 0) {
    const { data: parrots } = await supabase.from("parrots").select("id, name").in("name", payload.parrots);

    if (parrots && parrots.length > 0) {
      const { error: linkError } = await supabase.from("facility_parrots").insert(
        parrots.map(parrot => ({
          facility_id: created.id,
          parrot_id: parrot.id,
        })),
      );

      if (linkError) {
        await supabase.from("facilities").delete().eq("id", created.id);
        return { error: linkError.message };
      }
    }
  }

  return markSubmissionApproved(supabase, submission.id, reviewerId, created.id);
}

export async function approveSubmissionAction(
  _prev: SubmissionReviewResult,
  formData: FormData,
): Promise<SubmissionReviewResult> {
  try {
    const submissionId = String(formData.get("submissionId") ?? "").trim();
    if (!submissionId) {
      return { error: "投稿IDが不正です" };
    }

    const { supabase, session } = await getAuthedClient();
    const { submission, error } = await fetchPendingSubmission(supabase, submissionId);

    if (error || !submission) {
      return { error: error ?? "投稿が見つかりません" };
    }

    switch (submission.type) {
      case "parrot_create":
        return approveParrotCreate(supabase, submission, session.userId);
      case "facility_create":
        return approveFacilityCreate(supabase, submission, session.userId);
      default:
        return { error: "この投稿種別はまだ承認に対応していません" };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "承認に失敗しました" };
  }
}

export async function rejectSubmissionAction(
  _prev: SubmissionReviewResult,
  formData: FormData,
): Promise<SubmissionReviewResult> {
  try {
    const submissionId = String(formData.get("submissionId") ?? "").trim();
    const reviewerNote = String(formData.get("reviewerNote") ?? "").trim() || "管理者により却下されました";

    if (!submissionId) {
      return { error: "投稿IDが不正です" };
    }

    const { supabase, session } = await getAuthedClient();
    const { submission, error } = await fetchPendingSubmission(supabase, submissionId);

    if (error || !submission) {
      return { error: error ?? "投稿が見つかりません" };
    }

    const result = await markSubmissionRejected(supabase, submission.id, session.userId, reviewerNote);
    if (result.error) {
      return result;
    }

    return { success: "却下しました" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "却下に失敗しました" };
  }
}

async function fetchSubmission(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  submissionId: string,
): Promise<{ submission?: SubmissionRow; error?: string }> {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, status, payload")
    .eq("id", submissionId)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "投稿が見つかりません" };
  }

  return { submission: data as SubmissionRow };
}

export async function reopenSubmissionAction(
  _prev: SubmissionReviewResult,
  formData: FormData,
): Promise<SubmissionReviewResult> {
  try {
    const submissionId = String(formData.get("submissionId") ?? "").trim();
    if (!submissionId) {
      return { error: "投稿IDが不正です" };
    }

    const { supabase } = await getAuthedClient();
    const { submission, error } = await fetchSubmission(supabase, submissionId);

    if (error || !submission) {
      return { error: error ?? "投稿が見つかりません" };
    }

    if (submission.status === "approved") {
      return { error: "承認済みの投稿は承認待ちに戻せません" };
    }

    if (submission.status !== "rejected") {
      return { error: "却下済みの投稿のみ承認待ちに戻せます" };
    }

    const { data, error: updateError } = await supabase
      .from("submissions")
      .update({
        status: "pending",
        reviewer_note: null,
        reviewed_by: null,
        reviewed_at: null,
        target_id: null,
      })
      .eq("id", submissionId)
      .eq("status", "rejected")
      .select("id")
      .maybeSingle();

    if (updateError) {
      return { error: updateError.message };
    }

    if (!data) {
      return { error: "既に処理済みです" };
    }

    revalidateSubmissionPaths();
    return { success: "承認待ちに戻しました" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "承認待ちへの復帰に失敗しました" };
  }
}

export async function updateSubmissionPayloadAction(
  _prev: SubmissionReviewResult,
  formData: FormData,
): Promise<SubmissionReviewResult> {
  try {
    const submissionId = String(formData.get("submissionId") ?? "").trim();
    const submissionType = String(formData.get("submissionType") ?? "") as SubmissionType;

    if (!submissionId) {
      return { error: "投稿IDが不正です" };
    }

    const { supabase } = await getAuthedClient();
    const { submission, error } = await fetchPendingSubmission(supabase, submissionId);

    if (error || !submission) {
      return { error: error ?? "投稿が見つかりません" };
    }

    if (submission.type !== submissionType) {
      return { error: "投稿種別が一致しません" };
    }

    let payload: ParrotSubmissionPayload | FacilitySubmissionPayload;

    if (submissionType === "parrot_create") {
      payload = {
        name: String(formData.get("name") ?? "").trim(),
        habitat: String(formData.get("habitat") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      };
    } else if (submissionType === "facility_create") {
      const parrotsRaw = String(formData.get("parrots") ?? "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
      const address = String(formData.get("address") ?? "").trim();

      payload = {
        name: String(formData.get("name") ?? "").trim(),
        prefecture: String(formData.get("prefecture") ?? "").trim(),
        ...(address ? { address } : {}),
        website: String(formData.get("website") ?? "").trim(),
        parrots: parrotsRaw,
      };
    } else {
      return { error: "この投稿種別は編集に対応していません" };
    }

    const { data, error: updateError } = await supabase
      .from("submissions")
      .update({ payload })
      .eq("id", submissionId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) {
      return { error: updateError.message };
    }

    if (!data) {
      return { error: "既に処理済みです" };
    }

    revalidateSubmissionPaths();
    return { success: "内容を保存しました" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "保存に失敗しました" };
  }
}
