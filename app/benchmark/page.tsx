import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";

export default function BenchmarkPage() {
  return (
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <p className="text-sm font-bold text-primary">参考</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">種別の参考体重</h1>
          <p className="mt-2 text-sm text-muted">同じ種類の平均体重と比較する機能は準備中です。まずはグラフ画面の30日中央値をご利用ください。</p>
        </header>

        <Card>
          <Link href="/chart" className="text-sm font-semibold text-primary underline">
            グラフで30日中央値を見る
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
