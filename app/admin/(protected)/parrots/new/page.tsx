import Link from "next/link";
import ParrotForm from "@/components/admin/ParrotForm";
import Card from "@/components/ui/Card";

export default function AdminParrotNewPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/parrots" className="text-sm font-semibold text-primary underline">
          ← 図鑑一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">鳥種を追加</h1>
      </div>

      <Card>
        <ParrotForm />
      </Card>
    </div>
  );
}
