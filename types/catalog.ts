export type Parrot = {
  id: string;
  name: string;
  habitat: string;
  description: string;
  imageUrl: string;
};

export type Facility = {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  website: string;
  parrots: string[];
};

export type CatalogFilters = {
  prefecture?: string;
  parrotName?: string;
};

export type CatalogStatus = "draft" | "published" | "archived";

export type CatalogSource = "supabase" | "static";

export type AdminParrot = Parrot & {
  status: CatalogStatus;
};

export type AdminFacility = {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  website: string;
  status: CatalogStatus;
  parrotIds: string[];
  parrotNames: string[];
};
