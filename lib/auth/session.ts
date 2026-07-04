import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UserSession = {
  userId: string;
  email: string;
};

export async function getUserSession(): Promise<UserSession | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
    };
  } catch {
    return null;
  }
}
