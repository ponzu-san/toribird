import Link from "next/link";
import { getAdminSubmissions } from "@/lib/db/adminSubmissionsDb";
import type { SubmissionStatus } from "@/types/submission";
import SubmissionsList from "@/components/admin/SubmissionsList";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const statusFilters: Array<{ value: SubmissionStatus | "all"; label: string }> = [
  { value: "pending", label: "承認待ち" },
  { value: "approved", label: "承認済み" },
  { value: "rejected", label: "却下" },
  { value: "all", label: "すべて" },
];

function parseStatusFilter(value?: string): SubmissionStatus | undefined {
  if (value === "approved" || value === "rejected") {
    return value;
  }
  if (value === "all") {
    return undefined;
  }
  return "pending";
}

export default async function AdminSubmissionsPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams;
  const activeFilter = statusParam === "all" ? "all" : parseStatusFilter(statusParam);
  const status = activeFilter === "all" ? undefined : activeFilter;
  const submissions = await getAdminSubmissions(status);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">投稿管理</h1>
        <p className="mt-2 text-sm text-muted">ユーザーからの投稿を確認し、承認または却下できます</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map(filter => {
          const href = filter.value === "all" ? "/admin/submissions?status=all" : `/admin/submissions?status=${filter.value}`;
          const isActive = activeFilter === filter.value;

          return (
            <Link
              key={filter.value}
              href={href}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-white shadow-pop"
                  : "border-border bg-surface-elevated text-foreground hover:border-primary hover:bg-sky-soft"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <Card>
          <EmptyState
            title="投稿がありません"
            description={
              activeFilter === "pending"
                ? "承認待ちの投稿はまだありません。"
                : "この条件に一致する投稿はありません。"
            }
          />
        </Card>
      ) : (
        <SubmissionsList submissions={submissions} />
      )}
    </div>
  );
}
