"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submissionSuccessMessage } from "@/lib/utils/submissionNotice";

export type SubmissionActionState = {
  success?: string;
  error?: string;
};

async function getClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase が設定されていません");
  }
  return supabase;
}

export async function submitParrotSuggestionAction(
  _prev: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  try {
    const supabase = await getClient();

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
    };

    if (!payload.name) {
      return { error: "名前を入力してください。" };
    }

    const { error } = await supabase.from("submissions").insert({
      type: "parrot_create",
      payload,
      status: "pending",
    });

    if (error) {
      return { error: error.message };
    }

    return { success: submissionSuccessMessage };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "投稿に失敗しました。" };
  }
}

export async function submitFacilitySuggestionAction(
  _prev: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  try {
    const supabase = await getClient();

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      prefecture: String(formData.get("prefecture") ?? "").trim(),
    };

    if (!payload.name || !payload.prefecture) {
      return { error: "施設名と都道府県を入力してください。" };
    }

    const { error } = await supabase.from("submissions").insert({
      type: "facility_create",
      payload,
      status: "pending",
    });

    if (error) {
      return { error: error.message };
    }

    return { success: submissionSuccessMessage };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "投稿に失敗しました。" };
  }
}
