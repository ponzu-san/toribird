"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword, type AuthActionResult } from "@/lib/actions/userAuth";
import { authInputClass } from "@/lib/auth/formStyles";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(updatePassword, {});

  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">新しいパスワードを設定</h1>
          <p className="mt-2 text-sm text-muted">8文字以上のパスワードを入力してください</p>
        </header>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-muted">
              新しいパスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={authInputClass}
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="mb-2 block text-sm font-semibold text-muted">
              新しいパスワード（確認）
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={authInputClass}
            />
          </div>

          {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

          <Button type="submit" disabled={isPending} fullWidth>
            {isPending ? "更新中..." : "パスワードを更新"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login/forgot-password" className="text-primary underline">
            リンクが無効な場合は再送信
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
