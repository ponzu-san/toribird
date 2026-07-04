"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/welcome" || pathname === "/login" || pathname === "/signup") {
    return null;
  }
  return (
    <footer className="border-t border-border bg-surface-elevated pb-24 lg:pb-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted sm:flex-row lg:px-6">
        <p>© {new Date().getFullYear()} Toribird</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="transition hover:text-primary">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </footer>
  );
}
