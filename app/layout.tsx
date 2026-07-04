import { Noto_Sans_JP, Quicksand } from "next/font/google";
import "./globals.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HealthProvider from "@/components/health/HealthProvider";
import DevToolsGate from "@/components/dev/DevToolsGate";
import { getHealthContext } from "@/lib/actions/healthContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata = {
  title: "Toribird - インコの健康管理",
  description: "インコの体重・体調を毎日30秒で記録。異変に早く気づける健康管理アプリ。",
  manifest: "/manifest.json",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialAccess = await getHealthContext();

  return (
    <html lang="ja" className={`${notoSansJP.variable} ${quicksand.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-foreground antialiased">
        <HealthProvider initialAccess={initialAccess}>
          <Navigation />
          {children}
          <Footer />
          <DevToolsGate />
        </HealthProvider>
      </body>
    </html>
  );
}
