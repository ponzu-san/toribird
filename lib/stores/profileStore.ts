import { create } from "zustand";
import { getProfile, upsertProfile } from "@/lib/db/diaryDb";
import { fetchRegisteredProfileAction, saveRegisteredProfileAction } from "@/lib/actions/healthRecords";
import { useAccessStore } from "@/lib/stores/accessStore";
import {
  MAX_PROFILE_BIO_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MAX_SPECIES_CUSTOM_LENGTH,
  PROFILE_DEFAULT_ID,
  SPECIES_OTHER_ID,
  type ParrotProfile,
  type ProfileFormData,
} from "@/types/profile";

type ProfileState = {
  profile: ParrotProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  error: string | null;

  loadProfile: () => Promise<void>;
  saveProfile: (data: ProfileFormData) => Promise<boolean>;
  clearSaveMessage: () => void;
};

export function getSpeciesDisplayName(profile: ParrotProfile): string {
  if (profile.speciesId === SPECIES_OTHER_ID) {
    return profile.speciesCustom?.trim() || "その他";
  }
  return profile.speciesId;
}

function validateProfileData(data: ProfileFormData): string | null {
  const name = data.name.trim();
  if (!name) {
    return "名前を入力してください";
  }
  if (name.length > MAX_PROFILE_NAME_LENGTH) {
    return `名前は${MAX_PROFILE_NAME_LENGTH}文字以内で入力してください`;
  }
  if (!data.speciesId) {
    return "種類を選択してください";
  }
  if (data.speciesId === SPECIES_OTHER_ID) {
    const custom = data.speciesCustom?.trim();
    if (!custom) {
      return "その他の種類名を入力してください";
    }
    if (custom.length > MAX_SPECIES_CUSTOM_LENGTH) {
      return `種類名は${MAX_SPECIES_CUSTOM_LENGTH}文字以内で入力してください`;
    }
  }
  if (data.bio && data.bio.length > MAX_PROFILE_BIO_LENGTH) {
    return `自己紹介は${MAX_PROFILE_BIO_LENGTH}文字以内で入力してください`;
  }
  return null;
}

function isRegisteredMode(): boolean {
  return useAccessStore.getState().mode === "registered";
}

function isReadOnlyMode(): boolean {
  return useAccessStore.getState().isReadOnly;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  saveMessage: null,
  error: null,

  loadProfile: async () => {
    if (!useAccessStore.getState().initialized) {
      await useAccessStore.getState().init();
    }

    set({ isLoading: true, error: null });
    try {
      const profile = isRegisteredMode()
        ? await fetchRegisteredProfileAction()
        : await getProfile(PROFILE_DEFAULT_ID);
      set({ profile: profile ?? null, isLoading: false });
    } catch {
      set({ error: "プロフィールの読み込みに失敗しました", isLoading: false });
    }
  },

  saveProfile: async data => {
    if (isReadOnlyMode()) {
      set({ error: "体験期間が終了しました。登録すると編集を続けられます", saveMessage: null });
      return false;
    }

    const validationError = validateProfileData(data);
    if (validationError) {
      set({ error: validationError, saveMessage: null });
      return false;
    }

    set({ isSaving: true, error: null, saveMessage: null });

    try {
      let profile: ParrotProfile;

      if (isRegisteredMode()) {
        profile = await saveRegisteredProfileAction(data);
      } else {
        profile = await upsertProfile({
          id: PROFILE_DEFAULT_ID,
          name: data.name.trim(),
          speciesId: data.speciesId,
          speciesCustom: data.speciesId === SPECIES_OTHER_ID ? data.speciesCustom?.trim() : undefined,
          sex: data.sex || undefined,
          birthday: data.birthday || undefined,
          adoptedOn: data.adoptedOn || undefined,
          bio: data.bio?.trim() || undefined,
        });
      }

      set({ profile, isSaving: false, saveMessage: "保存しました" });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存に失敗しました";
      set({ isSaving: false, error: message });
      return false;
    }
  },

  clearSaveMessage: () => set({ saveMessage: null, error: null }),
}));
