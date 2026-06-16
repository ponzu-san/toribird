import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminFacility, getAdminParrotOptions } from "@/lib/db/adminCatalogDb";
import { deleteFacilityAction } from "@/lib/actions/adminCatalog";
import FacilityForm from "@/components/admin/FacilityForm";
import DeleteButton from "@/components/admin/DeleteButton";
import Card from "@/components/ui/Card";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminFacilityEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [facility, parrotOptions] = await Promise.all([getAdminFacility(id), getAdminParrotOptions()]);

  if (!facility) {
    notFound();
  }

  const deleteAction = deleteFacilityAction.bind(null, facility.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/facilities" className="text-sm font-semibold text-primary underline">
          ← 施設一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">{facility.name} を編集</h1>
      </div>

      {saved === "1" && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">保存しました</div>
      )}

      <Card>
        <FacilityForm facility={facility} parrotOptions={parrotOptions} />
      </Card>

      <Card>
        <DeleteButton label={facility.name} action={deleteAction} />
      </Card>
    </div>
  );
}
