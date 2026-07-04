"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthActionResult } from "@/lib/actions/userAuth";
import { authInputClass } from "@/lib/auth/formStyles";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(requestPasswordReset, {});

  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">パスワードをお忘れの方</h1>
          <p className="mt-2 text-sm text-muted">登録したメールアドレスに、パスワード再設定用のリンクを送信します</p>
        </header>

        {state.success ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.success}</div>
            <Link href="/login" className="block">
              <Button variant="secondary" fullWidth>
                ログインに戻る
              </Button>
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-muted">
                メールアドレス
              </label>
              <input id="email" name="email" type="email" autoComplete="email" required className={authInputClass} />
            </div>

            {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

            <Button type="submit" disabled={isPending} fullWidth>
              {isPending ? "送信中..." : "再設定メールを送信"}
            </Button>
          </form>
        )}

        {!state.success && (
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/login" className="text-primary underline">
              ログインに戻る
            </Link>
          </p>
        )}
      </Card>
    </PageShell>
  );
}
