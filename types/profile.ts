import type { ParrotSex } from "@/types/health";

export const PROFILE_DEFAULT_ID = "default";
export const SPECIES_OTHER_ID = "other";

export const MAX_PROFILE_NAME_LENGTH = 30;
export const MAX_PROFILE_BIO_LENGTH = 300;
export const MAX_SPECIES_CUSTOM_LENGTH = 50;

export type ParrotProfile = {
  id: string;
  name: string;
  speciesId: string;
  speciesCustom?: string;
  sex?: ParrotSex;
  birthday?: string;
  adoptedOn?: string;
  photoUrl?: string;
  bio?: string;
  updatedAt: string;
};

export type ProfileFormData = {
  name: string;
  speciesId: string;
  speciesCustom?: string;
  sex?: ParrotSex | "";
  birthday?: string;
  adoptedOn?: string;
  bio?: string;
};
