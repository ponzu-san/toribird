"use client";

import { useState } from "react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import Button from "@/components/ui/Button";
import InstallGuideModal from "@/components/pwa/InstallGuideModal";

export default function InstallAppCard() {
  const { canInstall, isInstalled, platform, guideKey, promptInstall } = usePwaInstall();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const isDesktop = platform === "desktop";

  if (isInstalled) {
    return (
      <div>
        <p className="text-xs font-semibold text-muted">ホーム画面に追加</p>
        <p className="mt-1 text-sm text-foreground">追加済みです</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted">ホーム画面に追加</p>
          <p className="mt-1 text-sm text-muted">アプリのように素早く開けるようになります</p>
        </div>

        {isDesktop ? (
          canInstall ? (
            <Button fullWidth onClick={() => void promptInstall()}>
              アプリをインストール
            </Button>
          ) : null
        ) : canInstall ? (
          <Button fullWidth onClick={() => void promptInstall()}>
            ホーム画面に追加
          </Button>
        ) : guideKey ? (
          <Button fullWidth variant="secondary" onClick={() => setIsGuideOpen(true)}>
            追加方法を見る
          </Button>
        ) : null}
      </div>

      {guideKey && (
        <InstallGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} guideKey={guideKey} />
      )}
    </>
  );
}
