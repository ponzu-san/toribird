import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminFacility, AdminParrot, CatalogStatus } from "@/types/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ParrotRow = {
  id: string;
  name: string;
  english_name: string;
  habitat: string;
  description: string;
  image_url: string | null;
  status: CatalogStatus;
};

type FacilityRow = {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  category: string;
  website: string | null;
  status: CatalogStatus;
  facility_parrots: Array<{
    parrot_id: string;
    parrots: { name: string } | null;
  }> | null;
};

function mapAdminParrot(row: ParrotRow): AdminParrot {
  return {
    id: row.id,
    name: row.name,
    englishName: row.english_name,
    habitat: row.habitat,
    description: row.description,
    imageUrl: row.image_url ?? "",
    status: row.status,
  };
}

function mapAdminFacility(row: FacilityRow): AdminFacility {
  const links = row.facility_parrots ?? [];

  return {
    id: row.id,
    name: row.name,
    prefecture: row.prefecture,
    address: row.address,
    category: row.category,
    website: row.website ?? "",
    status: row.status,
    parrotIds: links.map(link => link.parrot_id),
    parrotNames: links.map(link => link.parrots?.name).filter((name): name is string => Boolean(name)),
  };
}

async function getClient(): Promise<SupabaseClient> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase が設定されていません");
  }
  return supabase;
}

export async function getAdminParrots(): Promise<AdminParrot[]> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("parrots")
    .select("id, name, english_name, habitat, description, image_url, status")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(row => mapAdminParrot(row as ParrotRow));
}

export async function getAdminParrot(id: string): Promise<AdminParrot | null> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("parrots")
    .select("id, name, english_name, habitat, description, image_url, status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapAdminParrot(data as ParrotRow) : null;
}

export async function getAdminFacilities(): Promise<AdminFacility[]> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("facilities")
    .select(`
      id,
      name,
      prefecture,
      address,
      category,
      website,
      status,
      facility_parrots (
        parrot_id,
        parrots ( name )
      )
    `)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(row => mapAdminFacility(row as unknown as FacilityRow));
}

export async function getAdminFacility(id: string): Promise<AdminFacility | null> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("facilities")
    .select(`
      id,
      name,
      prefecture,
      address,
      category,
      website,
      status,
      facility_parrots (
        parrot_id,
        parrots ( name )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapAdminFacility(data as unknown as FacilityRow) : null;
}

export async function getAdminParrotOptions(): Promise<Array<{ id: string; name: string }>> {
  const parrots = await getAdminParrots();
  return parrots.map(parrot => ({ id: parrot.id, name: parrot.name }));
}
