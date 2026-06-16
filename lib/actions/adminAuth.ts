"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionResult = {
  error?: string;
};

export async function loginAdmin(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
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

  const session = await getAdminSession();
  if (!session) {
    await supabase.auth.signOut();
    return { error: "管理者権限がありません" };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/admin");
  redirect("/admin/login");
}
