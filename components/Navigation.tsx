"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "日記",
      match: (path: string) => path === "/",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      href: "/weight",
      label: "体重",
      match: (path: string) => path === "/weight",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      href: "/facilities",
      label: "施設",
      match: (path: string) => path === "/facilities",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      href: "/parrots",
      label: "図鑑",
      match: (path: string) => path === "/parrots",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-surface-elevated lg:hidden">
        <div className="flex h-14 items-center px-4">
          <Link href="/">
            <Image src="/logo.png" alt="Toribird - インコの飼育日記＆情報アプリ" width={160} height={48} className="h-11 w-auto" priority />
          </Link>
        </div>
      </nav>

      <nav className="sticky top-0 z-40 hidden border-b border-border bg-surface-elevated lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Toribird - インコの飼育日記＆情報アプリ" width={200} height={56} className="h-13 w-auto" priority />
            </Link>

            <div className="flex gap-1">
              {links.map(link => {
                const isActive = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "border border-primary-dark bg-primary text-white shadow-pop"
                        : "text-muted hover:bg-sky-soft hover:text-foreground"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-elevated lg:hidden">
        <div className="grid grid-cols-4">
          {links.map(link => {
            const isActive = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted"
                }`}
              >
                <div
                  className={`rounded-2xl p-1.5 transition-colors ${
                    isActive ? "border border-primary-dark bg-primary text-white shadow-pop" : ""
                  }`}
                >
                  {link.icon}
                </div>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
