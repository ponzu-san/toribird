import Link from "next/link";
import { logoutUser } from "@/lib/actions/userAuth";
import { getHealthContext } from "@/lib/actions/healthContext";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getUserSession } from "@/lib/auth/session";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default async function SettingsPage() {
  const session = await getUserSession();
  const health = await getHealthContext();
  const supabaseReady = isSupabaseConfigured();

  return (
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <p className="text-sm font-bold text-primary">設定</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">アカウント</h1>
        </header>

        <Card>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted">保存先</p>
              {!supabaseReady ? (
                <p className="mt-1 text-sm text-muted">Supabase 未設定のため、クラウド保存は利用できません</p>
              ) : health.mode === "registered" && session ? (
                <p className="mt-1 text-sm text-foreground">クラウドに保存されています（{session.email}）</p>
              ) : health.mode === "guest" ? (
                <p className="mt-1 text-sm text-muted">
                  体験モード（端末内保存）
                  {health.daysRemaining !== null && ` — あと ${health.daysRemaining} 日`}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">未登録</p>
              )}
            </div>

            {supabaseReady && health.mode !== "registered" && (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <Button fullWidth variant="secondary">
                    ログイン
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button fullWidth>新規登録</Button>
                </Link>
              </div>
            )}

            {session && (
              <form action={logoutUser}>
                <Button type="submit" variant="secondary" fullWidth>
                  ログアウト
                </Button>
              </form>
            )}
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">プラン</p>
            {health.mode === "registered" ? (
              health.plan === "plus" ? (
                <p className="text-sm text-foreground">Plus — 複数羽・広告なし（開発確認用表示）</p>
              ) : (
                <p className="text-sm text-foreground">Free（1羽まで）— 記録・グラフ・クラウド同期</p>
              )
            ) : (
              <p className="text-sm text-muted">未登録（体験モード）</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">その他</p>
            <Link href="/benchmark" className="block text-sm text-primary underline">
              種別の参考体重を見る
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
