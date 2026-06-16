import {
  getCatalogParrotFilterOptions,
  getCatalogPrefectures,
  getCatalogSource,
  getPublishedFacilities,
  getPublishedParrots,
} from "@/lib/db/catalogDb";
import CatalogSetupNotice from "@/components/CatalogSetupNotice";
import FacilitiesClient from "@/app/facilities/FacilitiesClient";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const [facilities, parrots, prefectures, parrotTypes] = await Promise.all([
    getPublishedFacilities(),
    getPublishedParrots(),
    getCatalogPrefectures(),
    getCatalogParrotFilterOptions(),
  ]);

  const source = getCatalogSource();

  return (
    <>
      {source === "static" && <CatalogSetupNotice source="static" />}
      <FacilitiesClient facilities={facilities} parrots={parrots} prefectures={prefectures} parrotTypes={parrotTypes} />
    </>
  );
}
