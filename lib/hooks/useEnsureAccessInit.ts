"use client";

import { useEffect } from "react";
import { useAccessStore } from "@/lib/stores/accessStore";

export function useEnsureAccessInit() {
  const initialized = useAccessStore(s => s.initialized);
  const init = useAccessStore(s => s.init);

  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);
}
