"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupUser, type AuthActionResult } from "@/lib/actions/userAuth";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import PasswordInput from "@/components/ui/PasswordInput";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-3 py-2.5 text-foreground placeholder:text-muted transition focus:border-primary focus:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary/25 lg:px-4";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(signupUser, {});

  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">新規登録</h1>
          <p className="mt-2 text-sm text-muted">記録をクラウドにバックアップできます</p>
        </header>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-muted">
              メールアドレス
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-muted">
              パスワード（8文字以上）
            </label>
            <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={8} inputClassName={inputClass} />
          </div>

          {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

          <Button type="submit" disabled={isPending} fullWidth>
            {isPending ? "登録中..." : "アカウントを作成"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-primary underline">
            ログイン
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
