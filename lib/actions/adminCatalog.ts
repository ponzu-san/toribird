"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CatalogStatus } from "@/types/catalog";

export type ActionResult = {
  error?: string;
};

const PLACEHOLDER_HABITAT = "（未登録）";
const PLACEHOLDER_DESCRIPTION = "（未登録）";

async function getAuthedClient() {
  await requireAdminSession();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase が設定されていません");
  }
  return supabase;
}

function revalidateCatalog() {
  revalidatePath("/admin/parrots");
  revalidatePath("/admin/facilities");
  revalidatePath("/parrots");
  revalidatePath("/facilities");
}

export async function saveParrotAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const id = String(formData.get("id") ?? "");
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      habitat: String(formData.get("habitat") ?? "").trim() || PLACEHOLDER_HABITAT,
      description: String(formData.get("description") ?? "").trim() || PLACEHOLDER_DESCRIPTION,
      image_url: String(formData.get("imageUrl") ?? "").trim() || null,
      status: String(formData.get("status") ?? "published") as CatalogStatus,
    };

    if (!payload.name) {
      return { error: "名前を入力してください" };
    }

    if (id) {
      const { error } = await supabase.from("parrots").update(payload).eq("id", id);
      if (error) {
        return { error: error.message };
      }
      revalidateCatalog();
      redirect(`/admin/parrots/${id}/edit?saved=1`);
    }

    const { data, error } = await supabase.from("parrots").insert(payload).select("id").single();
    if (error) {
      return { error: error.message };
    }

    revalidateCatalog();
    redirect(`/admin/parrots/${data.id}/edit?saved=1`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "保存に失敗しました" };
  }
}

export async function deleteParrotAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("parrots").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }

    revalidateCatalog();
    redirect("/admin/parrots");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "削除に失敗しました" };
  }
}

export async function saveFacilityAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const id = String(formData.get("id") ?? "");
    const parrotIds = formData.getAll("parrotIds").map(String);
    const address = String(formData.get("address") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      prefecture: String(formData.get("prefecture") ?? "").trim(),
      address: address || null,
      website: String(formData.get("website") ?? "").trim() || null,
      status: String(formData.get("status") ?? "published") as CatalogStatus,
    };

    if (!payload.name || !payload.prefecture) {
      return { error: "施設名と都道府県を入力してください" };
    }

    let facilityId = id;

    if (id) {
      const { error } = await supabase.from("facilities").update(payload).eq("id", id);
      if (error) {
        return { error: error.message };
      }
    } else {
      const { data, error } = await supabase.from("facilities").insert(payload).select("id").single();
      if (error) {
        return { error: error.message };
      }
      facilityId = data.id;
    }

    await supabase.from("facility_parrots").delete().eq("facility_id", facilityId);

    if (parrotIds.length > 0) {
      const { error: linkError } = await supabase.from("facility_parrots").insert(
        parrotIds.map(parrotId => ({
          facility_id: facilityId,
          parrot_id: parrotId,
        })),
      );
      if (linkError) {
        return { error: linkError.message };
      }
    }

    revalidateCatalog();
    redirect(`/admin/facilities/${facilityId}/edit?saved=1`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "保存に失敗しました" };
  }
}

export async function deleteFacilityAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("facilities").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }

    revalidateCatalog();
    redirect("/admin/facilities");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "削除に失敗しました" };
  }
}
