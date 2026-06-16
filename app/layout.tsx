import { Noto_Sans_JP, Quicksand } from "next/font/google";
import "./globals.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  title: "Toribird - インコの飼育日記",
  description: "インコの体重・体調・写真を毎日記録できる飼育日記アプリ。施設検索やインコ図鑑も利用できます。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${quicksand.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-foreground antialiased">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
