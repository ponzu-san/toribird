import Link from "next/link";
import { getAdminParrotOptions } from "@/lib/db/adminCatalogDb";
import FacilityForm from "@/components/admin/FacilityForm";
import Card from "@/components/ui/Card";

export default async function AdminFacilityNewPage() {
  const parrotOptions = await getAdminParrotOptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/facilities" className="text-sm font-semibold text-primary underline">
          ← 施設一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">施設を追加</h1>
      </div>

      <Card>
        <FacilityForm parrotOptions={parrotOptions} />
      </Card>
    </div>
  );
}
