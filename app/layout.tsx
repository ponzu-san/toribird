import "./globals.scss";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "インコナビ - インコが見られる施設検索",
  description: "日本全国のインコ・オウムに会える動物園や鳥カフェを検索できるサイト",
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
