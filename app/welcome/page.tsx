import Image from "next/image";
import Link from "next/link";
import { startGuestTrial } from "@/lib/actions/guestTrial";
import Button from "@/components/ui/Button";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function WelcomePage() {
  return (
    <PageShell width="narrow" className="lg:pb-8">
      <div className="space-y-6">
        <header className="text-center">
          <div className="mb-4 flex justify-center">
            <Image src="/logo.png" alt="Toribird" width={200} height={56} className="h-14 w-auto" priority />
          </div>
          <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            毎日30秒で、
            <br />
            うちの子の異変に気づく
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            体重と調子を記録して、グラフで変化を確認。インコの健康管理を、シンプルに続けられます。
          </p>
        </header>

        <Card>
          <ul className="space-y-4 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">今日</span>
              <span className="text-muted">体重・調子・メモを30秒で記録</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">グラフ</span>
              <span className="text-muted">7日・30日・90日の推移と30日中央値</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">うちの子</span>
              <span className="text-muted">名前・種類などプロフィール管理（1羽まで）</span>
            </li>
          </ul>
        </Card>

        <div className="space-y-3">
          <form action={startGuestTrial}>
            <Button type="submit" fullWidth>
              7日間無料で試す
            </Button>
          </form>
          <Link href="/signup">
            <Button variant="secondary" fullWidth>
              アカウント作成
            </Button>
          </Link>
          <p className="text-center text-xs text-muted">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-primary underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
