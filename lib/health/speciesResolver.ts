import type { SupabaseClient } from "@supabase/supabase-js";
import { SPECIES_OTHER_ID } from "@/types/profile";

export async function resolveSpeciesId(
  supabase: SupabaseClient,
  speciesId: string,
  speciesCustom?: string,
): Promise<{ speciesId: string | null; speciesCustom: string | null }> {
  if (speciesId === SPECIES_OTHER_ID) {
    return { speciesId: null, speciesCustom: speciesCustom ?? null };
  }

  const { data: existing } = await supabase.from("species").select("id").eq("name", speciesId).maybeSingle();
  if (existing?.id) {
    return { speciesId: existing.id, speciesCustom: null };
  }

  const { data: created, error } = await supabase.from("species").insert({ name: speciesId }).select("id").single();
  if (error || !created) {
    return { speciesId: null, speciesCustom: speciesId };
  }

  return { speciesId: created.id, speciesCustom: null };
}
