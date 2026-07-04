"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GUEST_COOKIE_NAME } from "@/lib/guest/constants";

export async function startGuestTrial() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE_NAME, new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}
