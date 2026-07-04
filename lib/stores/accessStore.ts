import { create } from "zustand";
import { getHealthContext } from "@/lib/actions/healthContext";
import type { AccessMode, HealthContext } from "@/types/access";
import type { SubscriptionPlan } from "@/types/health";

type AccessState = {
  mode: AccessMode | null;
  userId: string | null;
  plan: SubscriptionPlan | null;
  isReadOnly: boolean;
  daysRemaining: number | null;
  initialized: boolean;
  hydrateFromContext: (ctx: HealthContext) => void;
  init: () => Promise<void>;
};

export const useAccessStore = create<AccessState>((set, get) => ({
  mode: null,
  userId: null,
  plan: null,
  isReadOnly: false,
  daysRemaining: null,
  initialized: false,

  hydrateFromContext: (ctx) => {
    set({
      mode: ctx.mode,
      userId: ctx.userId ?? null,
      plan: ctx.plan ?? null,
      isReadOnly: ctx.isReadOnly,
      daysRemaining: ctx.daysRemaining,
      initialized: true,
    });
  },

  init: async () => {
    try {
      const ctx = await getHealthContext();
      set({
        mode: ctx.mode,
        userId: ctx.userId ?? null,
        plan: ctx.plan ?? null,
        isReadOnly: ctx.isReadOnly,
        daysRemaining: ctx.daysRemaining,
        initialized: true,
      });
    } catch {
      if (!get().initialized) {
        set({
          mode: "visitor",
          userId: null,
          plan: null,
          isReadOnly: true,
          daysRemaining: null,
          initialized: true,
        });
      }
    }
  },
}));
