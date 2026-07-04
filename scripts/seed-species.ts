import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { parrotDetails } from "../data/parrots";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("エラー: .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const names = Object.keys(parrotDetails);

  for (const name of names) {
    const { error } = await supabase.from("species").upsert({ name }, { onConflict: "name" });
    if (error) {
      throw new Error(`species の投入に失敗 (${name}): ${error.message}`);
    }
    console.log(`✓ ${name}`);
  }

  console.log(`\n${names.length} 件の species を投入しました`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
