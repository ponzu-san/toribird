import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Toribird",
  description: "Toribird のプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <PageShell width="narrow">
      <article className="prose-policy space-y-8 text-sm leading-relaxed text-foreground">
        <header>
          <p className="text-sm font-bold text-primary">Legal</p>
          <h1 className="mt-1 text-2xl font-bold">プライバシーポリシー</h1>
          <p className="mt-2 text-muted">最終更新日: 2026年6月15日</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">1. はじめに</h2>
          <p>
            Toribird（以下「当サービス」）は、インコの飼育日記や施設検索・図鑑などの機能を提供するウェブアプリケーションです。当サービスは、利用者のプライバシーを尊重し、個人情報の保護に努めます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">2. 収集する情報</h2>
          <p>当サービスでは、機能に応じて次の情報を扱う場合があります。</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>端末内に保存される情報（ローカルストレージ）</strong>
              <br />
              日記・体重・プロフィールなど、利用者が入力した飼育記録は、原則として利用者のブラウザ内（IndexedDB）にのみ保存されます。当サービスのサーバーには送信されません。
            </li>
            <li>
              <strong>施設・図鑑の閲覧情報</strong>
              <br />
              施設検索やインコ図鑑の表示のため、Supabase（データベースサービス）から公開情報を取得します。利用者がログインしていない場合、個人を特定する情報は収集しません。
            </li>
            <li>
              <strong>管理者アカウント情報</strong>
              <br />
              施設・図鑑の管理機能を利用する管理者について、Supabase Auth によりメールアドレスと認証情報を管理します。一般利用者向けの会員登録機能は提供していません。
            </li>
            <li>
              <strong>アクセスログ</strong>
              <br />
              ホスティングサービス（Vercel）およびデータベースサービス（Supabase）において、セキュリティ維持のため IP アドレス、アクセス日時、ブラウザ情報などが自動的に記録される場合があります。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">3. 情報の利用目的</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>当サービスの提供・維持・改善</li>
            <li>施設・図鑑など公開コンテンツの表示</li>
            <li>不正利用の防止およびセキュリティの確保</li>
            <li>お問い合わせへの対応</li>
            <li>将来、広告・アフィリエイトを導入する場合の配信および効果測定</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">4. 第三者への提供</h2>
          <p>当サービスは、以下の外部サービスを利用しています。各サービスのプライバシーポリシーもあわせてご確認ください。</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Vercel</strong>（ホスティング）
              <br />
              <a href="https://vercel.com/legal/privacy-policy" className="text-primary underline" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </a>
            </li>
            <li>
              <strong>Supabase</strong>（データベース・認証）
              <br />
              <a href="https://supabase.com/privacy" className="text-primary underline" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </a>
            </li>
          </ul>
          <p className="text-muted">
            将来、Google AdSense などの広告サービスやアフィリエイトプログラムを導入する場合は、本ポリシーを更新し、Cookie の利用について明示します。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">5. Cookie について</h2>
          <p>
            現時点では、管理者ログインのセッション維持のために認証関連の Cookie を使用する場合があります。将来、広告配信やアクセス解析を導入する際は、利用目的に応じた Cookie を使用し、必要に応じて同意取得の仕組みを設けます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">6. アフィリエイト・広告について</h2>
          <p>
            当サービスでは、将来的にアフィリエイトリンクや広告を掲載し、運営費の一部を補う場合があります。アフィリエイトリンクから商品・サービスを購入した場合、当サービス運営者に報酬が支払われることがあります。広告・アフィリエイトを含むコンテンツには、わかりやすい表示を行います。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">7. 情報の安全管理</h2>
          <p>
            当サービスは、不正アクセス・漏えい・改ざん・滅失を防止するため、適切なセキュリティ対策を講じます。ただし、インターネット上の通信において完全な安全性を保証することはできません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">8. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、当サービス内のお問い合わせフォーム、または運営者が指定する連絡先までご連絡ください。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">9. プライバシーポリシーの変更</h2>
          <p>
            当サービスは、法令の変更やサービス内容の変更に応じて、本ポリシーを改定することがあります。重要な変更がある場合は、当サービス上で告知します。
          </p>
        </section>
      </article>
    </PageShell>
  );
}
