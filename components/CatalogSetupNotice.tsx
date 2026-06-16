import type { CatalogSource } from "@/types/catalog";

type CatalogSetupNoticeProps = {
  source: CatalogSource;
};

export default function CatalogSetupNotice({ source }: CatalogSetupNoticeProps) {
  if (source !== "static") {
    return null;
  }

  return (
    <div className="px-4 pt-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Supabase が未設定のため、ローカルの静的データを表示しています。</p>
      <p className="mt-1">
        <code className="rounded bg-amber-100 px-1">.env.local</code> に Supabase の環境変数を設定し、
        <code className="rounded bg-amber-100 px-1">supabase/migrations/001_catalog.sql</code> の実行と{" "}
        <code className="rounded bg-amber-100 px-1">npm run seed:catalog</code> を行うと DB から読み込みます。
      </p>
      </div>
    </div>
  );
}
