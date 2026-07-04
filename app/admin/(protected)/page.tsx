import Link from "next/link";
import { getAdminFacilities, getAdminParrots } from "@/lib/db/adminCatalogDb";
import { getPendingSubmissionCount } from "@/lib/db/adminSubmissionsDb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [parrots, facilities, pendingSubmissions] = await Promise.all([
    getAdminParrots(),
    getAdminFacilities(),
    getPendingSubmissionCount(),
  ]);

  const publishedParrots = parrots.filter(parrot => parrot.status === "published").length;
  const publishedFacilities = facilities.filter(facility => facility.status === "published").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">管理ダッシュボード</h1>
        <p className="mt-2 text-sm text-muted">施設と図鑑のコンテンツを管理できます</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-muted">承認待ち投稿</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{pendingSubmissions}</p>
          <p className="mt-1 text-sm text-muted">ユーザーからの投稿</p>
          <Link href="/admin/submissions?status=pending" className="mt-4 inline-block">
            <Button variant="secondary">投稿を確認</Button>
          </Link>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-muted">図鑑（鳥種）</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{parrots.length}</p>
          <p className="mt-1 text-sm text-muted">公開中: {publishedParrots}件</p>
          <Link href="/admin/parrots" className="mt-4 inline-block">
            <Button variant="secondary">図鑑を管理</Button>
          </Link>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-muted">施設</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{facilities.length}</p>
          <p className="mt-1 text-sm text-muted">公開中: {publishedFacilities}件</p>
          <Link href="/admin/facilities" className="mt-4 inline-block">
            <Button variant="secondary">施設を管理</Button>
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-foreground">初回セットアップ</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>Supabase ダッシュボードで Authentication から管理者ユーザーを作成</li>
          <li>`002_admin_rls.sql` を SQL Editor で実行</li>
          <li>`admin_users` テーブルにユーザーの UUID とメールを登録</li>
        </ol>
      </Card>
    </div>
  );
}
