import type { SupabaseClient } from "@supabase/supabase-js";
import { facilities as staticFacilities } from "@/data/facilities";
import { parrotDetails as staticParrotDetails } from "@/data/parrots";
import { sortJapanese } from "@/lib/utils/sortJa";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CatalogFilters, CatalogSource, Facility, Parrot } from "@/types/catalog";

type ParrotRow = {
  id: string;
  name: string;
  english_name: string;
  habitat: string;
  description: string;
  image_url: string | null;
};

type FacilityParrotLink = {
  parrots: { name: string } | { name: string }[] | null;
};

type FacilityRow = {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  category: string;
  website: string | null;
  facility_parrots: FacilityParrotLink[] | null;
};

function mapParrot(row: ParrotRow): Parrot {
  return {
    id: row.id,
    name: row.name,
    englishName: row.english_name,
    habitat: row.habitat,
    description: row.description,
    imageUrl: row.image_url ?? "",
  };
}

function mapFacility(row: FacilityRow): Facility {
  const parrots = (row.facility_parrots ?? []).flatMap(link => {
    if (!link.parrots) {
      return [];
    }

    return Array.isArray(link.parrots) ? link.parrots.map(parrot => parrot.name) : [link.parrots.name];
  });

  return {
    id: row.id,
    name: row.name,
    prefecture: row.prefecture,
    address: row.address,
    category: row.category,
    website: row.website ?? "",
    parrots,
  };
}

function getStaticParrots(): Parrot[] {
  return Object.values(staticParrotDetails).map((parrot, index) => ({
    id: `static-${index}`,
    name: parrot.name,
    englishName: parrot.englishName,
    habitat: parrot.habitat,
    description: parrot.description,
    imageUrl: parrot.imageUrl,
  }));
}

function getStaticFacilities(filters?: CatalogFilters): Facility[] {
  return staticFacilities.filter(facility => {
    const matchesPrefecture = !filters?.prefecture || facility.prefecture === filters.prefecture;
    const matchesParrot = !filters?.parrotName || facility.parrots.includes(filters.parrotName);
    return matchesPrefecture && matchesParrot;
  });
}

async function fetchPublishedParrots(supabase: SupabaseClient): Promise<Parrot[]> {
  const { data, error } = await supabase
    .from("parrots")
    .select("id, name, english_name, habitat, description, image_url")
    .eq("status", "published")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapParrot);
}

async function fetchPublishedFacilities(supabase: SupabaseClient, filters?: CatalogFilters): Promise<Facility[]> {
  let query = supabase
    .from("facilities")
    .select(`
      id,
      name,
      prefecture,
      address,
      category,
      website,
      facility_parrots (
        parrots ( name )
      )
    `)
    .eq("status", "published")
    .order("name");

  if (filters?.prefecture) {
    query = query.eq("prefecture", filters.prefecture);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  let facilities = (data ?? []).map(row => mapFacility(row as unknown as FacilityRow));

  if (filters?.parrotName) {
    facilities = facilities.filter(facility => facility.parrots.includes(filters.parrotName!));
  }

  return facilities;
}

export function getCatalogSource(): CatalogSource {
  return isSupabaseConfigured() ? "supabase" : "static";
}

export async function getPublishedParrots(client?: SupabaseClient | null): Promise<Parrot[]> {
  const supabase = client ?? createSupabaseAnonClient();

  if (!supabase) {
    return getStaticParrots();
  }

  try {
    return await fetchPublishedParrots(supabase);
  } catch {
    return getStaticParrots();
  }
}

export async function getPublishedParrotByName(name: string, client?: SupabaseClient | null): Promise<Parrot | null> {
  const parrots = await getPublishedParrots(client);
  return parrots.find(parrot => parrot.name === name) ?? null;
}

export async function getPublishedParrotNames(client?: SupabaseClient | null): Promise<string[]> {
  const parrots = await getPublishedParrots(client);
  return sortJapanese(parrots.map(parrot => parrot.name));
}

export async function getPublishedFacilities(filters?: CatalogFilters, client?: SupabaseClient | null): Promise<Facility[]> {
  const supabase = client ?? createSupabaseAnonClient();

  if (!supabase) {
    return getStaticFacilities(filters);
  }

  try {
    return await fetchPublishedFacilities(supabase, filters);
  } catch {
    return getStaticFacilities(filters);
  }
}

export async function getCatalogPrefectures(client?: SupabaseClient | null): Promise<string[]> {
  const facilities = await getPublishedFacilities(undefined, client);
  return Array.from(new Set(facilities.map(facility => facility.prefecture))).sort();
}

export async function getCatalogParrotFilterOptions(client?: SupabaseClient | null): Promise<string[]> {
  const facilities = await getPublishedFacilities(undefined, client);
  return sortJapanese(Array.from(new Set(facilities.flatMap(facility => facility.parrots))));
}
