"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdmin, type AuthActionResult } from "@/lib/actions/adminAuth";
import { adminInputClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(loginAdmin, {});

  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">管理者ログイン</h1>
          <p className="mt-2 text-sm text-muted">施設・図鑑の管理画面にログインします</p>
        </header>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className={adminLabelClass}>
              メールアドレス
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={adminInputClass} />
          </div>

          <div>
            <label htmlFor="password" className={adminLabelClass}>
              パスワード
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={adminInputClass} />
          </div>

          {state.error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</div>}

          <Button type="submit" disabled={isPending} fullWidth>
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-primary underline">
            サイトに戻る
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
