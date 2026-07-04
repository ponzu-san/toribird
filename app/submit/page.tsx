import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import SubmissionNotice from "@/components/SubmissionNotice";

export default function SubmitTopPage() {
  return (
    <PageShell width="narrow">
      <div className="space-y-5">
        <header>
          <p className="text-sm font-bold text-primary">投稿</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">情報を投稿する</h1>
          <p className="mt-2 text-sm text-muted">図鑑や施設一覧への掲載候補を送れます。</p>
        </header>

        <SubmissionNotice />

        <Card>
          <h2 className="text-lg font-bold text-foreground">インコ情報を投稿</h2>
          <p className="mt-2 text-sm text-muted">図鑑に載せたいインコ・オウムの名前を送れます。</p>
          <Link
            href="/submit/parrot"
            className="mt-4 inline-flex items-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-pop transition hover:bg-primary-dark"
          >
            インコ情報を投稿する
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-foreground">施設情報を投稿</h2>
          <p className="mt-2 text-sm text-muted">インコが見られる施設の名前と都道府県を送れます。</p>
          <Link
            href="/submit/facility"
            className="mt-4 inline-flex items-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-pop transition hover:bg-primary-dark"
          >
            施設情報を投稿する
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
