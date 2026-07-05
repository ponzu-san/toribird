"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildAuthCallbackUrl, getRequestOrigin } from "@/lib/utils/siteUrl";

export type AuthActionResult = {
  error?: string;
  success?: string;
};

export async function loginUser(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase が設定されていません" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "ログインに失敗しました。メールアドレスとパスワードを確認してください" };
  }

  redirect("/");
}

export async function signupUser(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  if (password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase が設定されていません" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(await getRequestOrigin(), "/"),
    },
  });
  if (error) {
    return { error: "アカウント作成に失敗しました。別のメールアドレスをお試しください" };
  }

  if (data.session) {
    revalidatePath("/");
    redirect("/");
  }

  redirect("/login?registered=pending");
}

export async function logoutUser() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/");
  redirect("/login");
}

export async function requestPasswordReset(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "メールアドレスを入力してください" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase が設定されていません" };
  }

  const redirectTo = buildAuthCallbackUrl(await getRequestOrigin(), "/reset-password");

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  return {
    success: "登録されている場合、パスワード再設定用のメールを送信しました。メール内のリンクから新しいパスワードを設定してください。",
  };
}

export async function updatePassword(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!password || !passwordConfirm) {
    return { error: "パスワードを入力してください" };
  }

  if (password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  if (password !== passwordConfirm) {
    return { error: "パスワードが一致しません" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase が設定されていません" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "パスワードの更新に失敗しました。リンクの有効期限が切れている可能性があります。再度お試しください。" };
  }

  revalidatePath("/");
  redirect("/");
}
