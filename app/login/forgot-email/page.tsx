import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ForgotEmailPage() {
  return (
    <PageShell width="narrow" className="lg:pb-8">
      <Card>
        <header className="mb-6">
          <p className="text-sm font-bold text-primary">Toribird</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">メールアドレスをお忘れの方</h1>
          <p className="mt-2 text-sm text-muted">登録時に使ったメールアドレスを、次の方法で確認してみてください</p>
        </header>

        <ol className="space-y-4 text-sm leading-relaxed text-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-soft text-xs font-bold text-primary">1</span>
            <div>
              <p className="font-semibold">登録確認メールを探す</p>
              <p className="mt-1 text-muted">
                受信トレイ・迷惑メール・プロモーションを検索してください。件名や送信元に「Toribird」「Supabase」「確認」などが含まれる場合があります。
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-soft text-xs font-bold text-primary">2</span>
            <div>
              <p className="font-semibold">ブラウザに保存されていないか確認する</p>
              <p className="mt-1 text-muted">Chrome や Safari などのパスワードマネージャー、または以前ログインした端末を確認してください。</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-soft text-xs font-bold text-primary">3</span>
            <div>
              <p className="font-semibold">使いそうなアドレスを思い出す</p>
              <p className="mt-1 text-muted">普段使いの Gmail や iCloud など、複数候補がある場合は順にログインを試してください。</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-soft text-xs font-bold text-primary">4</span>
            <div>
              <p className="font-semibold">パスワードだけ忘れた場合</p>
              <p className="mt-1 text-muted">
                メールアドレスが分かれば{" "}
                <Link href="/login/forgot-password" className="text-primary underline">
                  パスワード再設定
                </Link>
                から新しいパスワードを設定できます。
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          <p className="font-semibold text-foreground">それでも分からない場合</p>
          <p className="mt-1">
            新規登録して別のアカウントで使い始めることができます。ゲスト体験中の記録は、端末内に残っている場合があります。
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="flex-1">
            <Button fullWidth>新規登録</Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button variant="secondary" fullWidth>
              ログインに戻る
            </Button>
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
