"use client";

import { useEffect, useRef } from "react";
import { useAccessStore } from "@/lib/stores/accessStore";
import { mergeGuestDataAction } from "@/lib/actions/mergeGuestData";
import { db, getProfile } from "@/lib/db/diaryDb";
import { PROFILE_DEFAULT_ID } from "@/types/profile";
import type { HealthContext } from "@/types/access";

async function clearGuestLocalData() {
  await db.dailyRecords.clear();
  await db.profiles.delete(PROFILE_DEFAULT_ID);
}

export default function HealthProvider({
  children,
  initialAccess,
}: {
  children: React.ReactNode;
  initialAccess: HealthContext;
}) {
  const init = useAccessStore(s => s.init);
  const mergeAttempted = useRef(false);
  const hydrated = useRef(false);

  if (!hydrated.current) {
    useAccessStore.getState().hydrateFromContext(initialAccess);
    hydrated.current = true;
  }

  useEffect(() => {
    void (async () => {
      if (mergeAttempted.current) return;
      mergeAttempted.current = true;

      const mode = useAccessStore.getState().mode;
      if (mode !== "registered") return;

      const profile = await getProfile(PROFILE_DEFAULT_ID);
      const records = await db.dailyRecords.toArray();
      if (!profile && records.length === 0) return;

      const result = await mergeGuestDataAction({
        profile: profile ?? null,
        records,
      });

      if (result.ok) {
        await clearGuestLocalData();
        await init();
        const { useDiaryStore } = await import("@/lib/stores/diaryStore");
        const { useProfileStore } = await import("@/lib/stores/profileStore");
        await useDiaryStore.getState().init();
        await useProfileStore.getState().loadProfile();
      }
    })();
  }, [init]);

  return <>{children}</>;
}
