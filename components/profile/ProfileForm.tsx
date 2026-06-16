"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPublishedParrotNames } from "@/lib/db/catalogDb";
import {
  MAX_PROFILE_BIO_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MAX_SPECIES_CUSTOM_LENGTH,
  SPECIES_OTHER_ID,
  type ParrotProfile,
} from "@/types/profile";
import { useProfileStore } from "@/lib/stores/profileStore";
import Button from "@/components/ui/Button";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-3 py-2.5 text-foreground placeholder:text-muted transition focus:border-primary focus:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary/25 lg:px-4";

const selectClass =
  "w-full rounded-2xl border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 lg:px-4";

interface ProfileFormProps {
  profile: ParrotProfile | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

export default function ProfileForm({ profile, onSaved, onCancel }: ProfileFormProps) {
  const { saveProfile, isSaving, error, saveMessage, clearSaveMessage } = useProfileStore();

  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [speciesCustom, setSpeciesCustom] = useState("");
  const [bio, setBio] = useState("");
  const [parrotNames, setParrotNames] = useState<string[]>([]);

  useEffect(() => {
    async function loadParrotNames() {
      const supabase = createSupabaseBrowserClient();
      const names = await getPublishedParrotNames(supabase);
      setParrotNames(names);
    }

    loadParrotNames();
  }, []);

  useEffect(() => {
    setName(profile?.name ?? "");
    setSpeciesId(profile?.speciesId ?? "");
    setSpeciesCustom(profile?.speciesCustom ?? "");
    setBio(profile?.bio ?? "");
    clearSaveMessage();
  }, [profile, clearSaveMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await saveProfile({
      name,
      speciesId,
      speciesCustom: speciesId === SPECIES_OTHER_ID ? speciesCustom : undefined,
      bio,
    });

    if (success) {
      onSaved?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-muted">
          名前
        </label>
        <input
          id="profile-name"
          type="text"
          maxLength={MAX_PROFILE_NAME_LENGTH}
          placeholder="例: ピーちゃん"
          value={name}
          onChange={e => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="profile-species" className="mb-2 block text-sm font-semibold text-muted">
          種類
        </label>
        <select id="profile-species" value={speciesId} onChange={e => setSpeciesId(e.target.value)} className={selectClass}>
          <option value="">選択してください</option>
          {parrotNames.map(species => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
          <option value={SPECIES_OTHER_ID}>その他</option>
        </select>
      </div>

      {speciesId === SPECIES_OTHER_ID && (
        <div>
          <label htmlFor="profile-species-custom" className="mb-2 block text-sm font-semibold text-muted">
            その他の種類名
          </label>
          <input
            id="profile-species-custom"
            type="text"
            maxLength={MAX_SPECIES_CUSTOM_LENGTH}
            placeholder="例: ルティノセキセイインコ"
            value={speciesCustom}
            onChange={e => setSpeciesCustom(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="profile-bio" className="mb-2 block text-sm font-semibold text-muted">
          自己紹介
        </label>
        <textarea
          id="profile-bio"
          rows={4}
          maxLength={MAX_PROFILE_BIO_LENGTH}
          placeholder="性格や好きなことなど..."
          value={bio}
          onChange={e => setBio(e.target.value)}
          className={`resize-none ${inputClass}`}
        />
        <p className="mt-1.5 text-right text-xs text-muted">
          {bio.length}/{MAX_PROFILE_BIO_LENGTH}
        </p>
      </div>

      {error && <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      {saveMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{saveMessage}</div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={isSaving} fullWidth className={onCancel ? "flex-1" : ""}>
          {isSaving ? "保存中..." : "保存する"}
        </Button>
      </div>
    </form>
  );
}
