"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SETTINGS_RETURN_KEY = "toribird:settingsReturnTo";

function saveSettingsReturnPath(path: string) {
  sessionStorage.setItem(SETTINGS_RETURN_KEY, path);
}

function consumeSettingsReturnPath(): string {
  const path = sessionStorage.getItem(SETTINGS_RETURN_KEY) ?? "/";
  sessionStorage.removeItem(SETTINGS_RETURN_KEY);
  return path;
}

function SettingsGearIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SettingsCloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SettingsNavButton({ variant }: { variant: "icon" | "text" }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSettings = pathname === "/settings";

  const handleClick = () => {
    if (isSettings) {
      router.push(consumeSettingsReturnPath());
    } else {
      saveSettingsReturnPath(pathname);
      router.push("/settings");
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="rounded-xl p-2 text-muted hover:bg-sky-soft hover:text-foreground"
        aria-label={isSettings ? "設定を閉じる" : "設定"}
      >
        {isSettings ? <SettingsCloseIcon /> : <SettingsGearIcon />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        isSettings
          ? "border border-primary-dark bg-primary text-white shadow-pop"
          : "text-muted hover:bg-sky-soft hover:text-foreground"
      }`}
      aria-label={isSettings ? "設定を閉じる" : "設定"}
    >
      設定
    </button>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/welcome") {
    return null;
  }

  const links = [
    {
      href: "/",
      label: "今日",
      match: (path: string) => path === "/",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      href: "/chart",
      label: "グラフ",
      match: (path: string) => path === "/chart" || path === "/weight",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      href: "/parrot",
      label: "うちの子",
      match: (path: string) => path === "/parrot" || path === "/profile",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-surface-elevated lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/">
            <Image src="/logo.png" alt="Toribird - インコの健康管理アプリ" width={160} height={48} className="h-11 w-auto" priority />
          </Link>
          <SettingsNavButton variant="icon" />
        </div>
      </nav>

      <nav className="sticky top-0 z-40 hidden border-b border-border bg-surface-elevated lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Toribird - インコの健康管理アプリ" width={200} height={56} className="h-13 w-auto" priority />
            </Link>

            <div className="flex items-center gap-1">
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
              <SettingsNavButton variant="text" />
            </div>
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-elevated lg:hidden">
        <div className="grid grid-cols-3">
          {links.map(link => {
            const isActive = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold tracking-tight transition-colors ${
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
