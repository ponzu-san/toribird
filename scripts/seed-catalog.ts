import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { facilities } from "../data/facilities";
import { parrotDetails } from "../data/parrots";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("エラー: .env.local に以下を設定してください:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedParrots(): Promise<Map<string, string>> {
  const nameToId = new Map<string, string>();

  for (const detail of Object.values(parrotDetails)) {
    const { data, error } = await supabase
      .from("parrots")
      .upsert(
        {
          name: detail.name,
          english_name: detail.englishName,
          habitat: detail.habitat,
          description: detail.description,
          image_url: detail.imageUrl || null,
          status: "published",
        },
        { onConflict: "name" },
      )
      .select("id, name")
      .single();

    if (error) {
      throw new Error(`parrots の投入に失敗 (${detail.name}): ${error.message}`);
    }

    nameToId.set(data.name, data.id);
    console.log(`  ✓ ${data.name}`);
  }

  return nameToId;
}

async function seedFacilities(parrotNameToId: Map<string, string>): Promise<Map<string, string>> {
  const legacyIdToFacilityId = new Map<string, string>();

  for (const facility of facilities) {
    const { data, error } = await supabase
      .from("facilities")
      .upsert(
        {
          legacy_id: facility.id,
          name: facility.name,
          prefecture: facility.prefecture,
          address: facility.address,
          category: facility.category,
          website: facility.website || null,
          status: "published",
        },
        { onConflict: "legacy_id" },
      )
      .select("id, legacy_id")
      .single();

    if (error) {
      throw new Error(`facilities の投入に失敗 (${facility.name}): ${error.message}`);
    }

    legacyIdToFacilityId.set(data.legacy_id, data.id);

    await supabase.from("facility_parrots").delete().eq("facility_id", data.id);

    for (const parrotName of facility.parrots) {
      const parrotId = parrotNameToId.get(parrotName);
      if (!parrotId) {
        console.warn(`  ! 鳥種が見つかりません: ${parrotName} (${facility.name})`);
        continue;
      }

      const { error: linkError } = await supabase.from("facility_parrots").insert({
        facility_id: data.id,
        parrot_id: parrotId,
      });

      if (linkError) {
        throw new Error(`facility_parrots の投入に失敗 (${facility.name} / ${parrotName}): ${linkError.message}`);
      }
    }

    console.log(`  ✓ ${facility.name}`);
  }

  return legacyIdToFacilityId;
}

async function main() {
  console.log("toribird カタログデータを Supabase に投入します...\n");

  console.log("鳥種（parrots）:");
  const parrotNameToId = await seedParrots();

  console.log("\n施設（facilities）:");
  await seedFacilities(parrotNameToId);

  console.log("\n完了しました。Supabase の Table Editor でデータを確認してください。");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
