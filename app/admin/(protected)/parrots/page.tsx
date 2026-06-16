import Link from "next/link";
import { getAdminParrots } from "@/lib/db/adminCatalogDb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

const statusLabels = {
  draft: "下書き",
  published: "公開",
  archived: "アーカイブ",
} as const;

export default async function AdminParrotsPage() {
  const parrots = await getAdminParrots();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">図鑑管理</h1>
          <p className="mt-2 text-sm text-muted">{parrots.length}件の鳥種</p>
        </div>
        <Link href="/admin/parrots/new">
          <Button>新規追加</Button>
        </Link>
      </div>

      <Card className="overflow-x-auto !p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-sky-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">名前</th>
              <th className="px-4 py-3 font-semibold">英語名</th>
              <th className="px-4 py-3 font-semibold">状態</th>
              <th className="px-4 py-3 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody>
            {parrots.map(parrot => (
              <tr key={parrot.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium text-foreground">{parrot.name}</td>
                <td className="px-4 py-3 text-muted">{parrot.englishName}</td>
                <td className="px-4 py-3 text-muted">{statusLabels[parrot.status]}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/parrots/${parrot.id}/edit`} className="font-semibold text-primary underline">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
