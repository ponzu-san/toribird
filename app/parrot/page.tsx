"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProfileStore, getSpeciesDisplayName } from "@/lib/stores/profileStore";
import { useAccessStore } from "@/lib/stores/accessStore";
import ProfileForm from "@/components/profile/ProfileForm";
import AccessBanner from "@/components/health/AccessBanner";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";

function formatDateLabel(dateKey?: string): string | null {
  if (!dateKey) return null;
  const [year, month, day] = dateKey.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export default function ParrotPage() {
  const { profile, isLoading, loadProfile } = useProfileStore();
  const isReadOnly = useAccessStore(s => s.isReadOnly);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile && !isReadOnly) {
      setIsEditing(true);
    }
  }, [profile, isReadOnly]);

  const showForm = !isReadOnly && (isEditing || !profile);

  return (
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <p className="text-sm font-bold text-primary">うちの子</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">プロフィール</h1>
          <p className="mt-1 text-xs text-muted">現在1羽まで登録できます</p>
        </header>

        <AccessBanner />

        {isLoading ? (
          <Card>
            <LoadingState />
          </Card>
        ) : showForm ? (
          <Card>
            {!profile && <p className="mb-4 text-sm text-muted">インコのプロフィールを登録しましょう</p>}
            <ProfileForm
              profile={profile}
              onSaved={() => {
                setIsEditing(false);
                loadProfile();
              }}
              onCancel={profile ? () => setIsEditing(false) : undefined}
            />
          </Card>
        ) : isReadOnly && !profile ? (
          <Card>
            <p className="text-sm text-muted">体験期間が終了しました。プロフィールを登録するにはアカウント登録が必要です。</p>
            <Link href="/signup" className="mt-4 block">
              <Button fullWidth>無料登録</Button>
            </Link>
          </Card>
        ) : (
          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted">名前</p>
                <p className="mt-1 text-xl font-bold text-foreground">{profile!.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">種類</p>
                <p className="mt-1 text-base font-medium text-foreground">{getSpeciesDisplayName(profile!)}</p>
              </div>
              {profile!.sex && (
                <div>
                  <p className="text-xs font-semibold text-muted">性別</p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {profile!.sex === "male" ? "オス" : profile!.sex === "female" ? "メス" : "不明"}
                  </p>
                </div>
              )}
              {profile!.birthday && (
                <div>
                  <p className="text-xs font-semibold text-muted">誕生日</p>
                  <p className="mt-1 text-base font-medium text-foreground">{formatDateLabel(profile!.birthday)}</p>
                </div>
              )}
              {profile!.bio && (
                <div>
                  <p className="text-xs font-semibold text-muted">自己紹介</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{profile!.bio}</p>
                </div>
              )}
              {!isReadOnly && (
                <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
                  編集する
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
