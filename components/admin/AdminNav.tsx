import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/adminAuth";
import Button from "@/components/ui/Button";

type AdminNavProps = {
  email: string;
};

const links = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/submissions", label: "投稿" },
  { href: "/admin/parrots", label: "図鑑" },
  { href: "/admin/facilities", label: "施設" },
];

export default function AdminNav({ email }: AdminNavProps) {
  return (
    <header className="border-b border-border bg-surface-elevated">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div>
          <p className="text-sm font-bold text-primary">Toribird Admin</p>
          <p className="text-xs text-muted">{email}</p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-sky-soft"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:text-primary">
            サイトを見る
          </Link>
          <form action={logoutAdmin}>
            <Button type="submit" variant="secondary" className="!py-2 !text-sm">
              ログアウト
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
