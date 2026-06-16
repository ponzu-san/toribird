"use client";

import { useEffect, useState } from "react";
import { useProfileStore, getSpeciesDisplayName } from "@/lib/stores/profileStore";
import ProfileForm from "@/components/profile/ProfileForm";
import LocalStorageNotice from "@/components/diary/LocalStorageNotice";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";

export default function ProfilePage() {
  const { profile, isLoading, loadProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile) {
      setIsEditing(true);
    }
  }, [profile]);

  const showForm = isEditing || !profile;

  return (
    <PageShell width="narrow">
      <div className="space-y-4">
        <header>
          <p className="text-sm font-bold text-primary">プロフィール</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">うちのインコ</h1>
        </header>

        <LocalStorageNotice />

        {isLoading ? (
          <Card>
            <LoadingState />
          </Card>
        ) : showForm ? (
          <Card>
            {!profile && (
              <p className="mb-4 text-sm text-muted">インコのプロフィールを登録しましょう</p>
            )}
            <ProfileForm
              profile={profile}
              onSaved={() => {
                setIsEditing(false);
                loadProfile();
              }}
              onCancel={profile ? () => setIsEditing(false) : undefined}
            />
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
              {profile!.bio && (
                <div>
                  <p className="text-xs font-semibold text-muted">自己紹介</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{profile!.bio}</p>
                </div>
              )}
              <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
                編集する
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
