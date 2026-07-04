"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type AuthActionResult } from "@/lib/actions/userAuth";
import { authInputClass } from "@/lib/auth/formStyles";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(loginUser, {});

  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">ログイン</h1>
          <p className="mt-2 text-sm text-muted">クラウド同期のためにログインします</p>
        </header>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-muted">
              メールアドレス
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={authInputClass} />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-muted">
              パスワード
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={authInputClass} />
            <div className="mt-2 flex flex-col gap-1 text-xs">
              <Link href="/login/forgot-password" className="text-primary underline">
                パスワードをお忘れの方
              </Link>
              <Link href="/login/forgot-email" className="text-primary underline">
                メールアドレスをお忘れの方
              </Link>
            </div>
          </div>

          {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

          <Button type="submit" disabled={isPending} fullWidth>
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-primary underline">
            新規登録
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
