import { getCatalogSource, getPublishedParrots } from "@/lib/db/catalogDb";
import CatalogSetupNotice from "@/components/CatalogSetupNotice";
import ParrotsClient from "@/app/parrots/ParrotsClient";

export const dynamic = "force-dynamic";

export default async function ParrotsPage() {
  const parrots = await getPublishedParrots();
  const source = getCatalogSource();

  return (
    <>
      {source === "static" && <CatalogSetupNotice source="static" />}
      <ParrotsClient parrots={parrots} />
    </>
  );
}
