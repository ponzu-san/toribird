"use client";

import { useActionState } from "react";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SubmissionNotice from "@/components/SubmissionNotice";
import { submitFacilitySuggestionAction, type SubmissionActionState } from "@/lib/actions/submissions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-3 py-2.5 text-foreground placeholder:text-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

export default function SubmitFacilityPage() {
  const [state, formAction, isPending] = useActionState<SubmissionActionState, FormData>(submitFacilitySuggestionAction, {});

  return (
    <PageShell width="narrow">
      <div className="space-y-5">
        <header>
          <p className="text-sm font-bold text-primary">投稿</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">施設情報の投稿</h1>
          <p className="mt-2 text-sm text-muted">
            インコが見られる施設の名前と都道府県を送ってください。詳細は管理者が確認・追加します。
          </p>
        </header>

        <SubmissionNotice />

        <Card>
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-muted">
                施設名（必須）
              </label>
              <input id="name" name="name" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="prefecture" className="mb-2 block text-sm font-semibold text-muted">
                都道府県（必須）
              </label>
              <input id="prefecture" name="prefecture" required placeholder="例: 東京都" className={inputClass} />
            </div>

            {state.error && <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</p>}
            {state.success && (
              <p className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{state.success}</p>
            )}

            <Button type="submit" disabled={isPending} fullWidth>
              {isPending ? "送信中..." : "投稿する"}
            </Button>
          </form>
        </Card>

        <div className="text-center text-sm">
          <Link href="/submit" className="font-semibold text-primary underline">
            投稿トップに戻る
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
