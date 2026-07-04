import { getUserSession } from "@/lib/auth/session";

export type UserSession = {
  userId: string;
  email: string;
};

export async function requireUserSession(): Promise<UserSession> {
  const session = await getUserSession();
  if (!session) {
    throw new Error("ログインが必要です");
  }
  return session;
}
