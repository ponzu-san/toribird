import "./globals.scss";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "Toribird - インコの飼育日記",
  description: "インコの体重・体調・写真を毎日記録できる飼育日記アプリ。施設検索やインコ図鑑も利用できます。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
