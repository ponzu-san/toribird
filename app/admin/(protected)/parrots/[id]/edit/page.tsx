import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminParrot } from "@/lib/db/adminCatalogDb";
import { deleteParrotAction } from "@/lib/actions/adminCatalog";
import ParrotForm from "@/components/admin/ParrotForm";
import DeleteButton from "@/components/admin/DeleteButton";
import Card from "@/components/ui/Card";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminParrotEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const parrot = await getAdminParrot(id);

  if (!parrot) {
    notFound();
  }

  const deleteAction = deleteParrotAction.bind(null, parrot.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/parrots" className="text-sm font-semibold text-primary underline">
          ← 図鑑一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">{parrot.name} を編集</h1>
      </div>

      {saved === "1" && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">保存しました</div>
      )}

      <Card>
        <ParrotForm parrot={parrot} />
      </Card>

      <Card>
        <DeleteButton label={parrot.name} action={deleteAction} />
      </Card>
    </div>
  );
}
