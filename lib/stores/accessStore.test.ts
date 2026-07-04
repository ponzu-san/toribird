import { describe, expect, it, beforeEach } from "vitest";
import { useAccessStore } from "@/lib/stores/accessStore";

describe("accessStore", () => {
  beforeEach(() => {
    useAccessStore.setState({
      mode: null,
      userId: null,
      plan: null,
      isReadOnly: false,
      daysRemaining: null,
      initialized: false,
    });
  });

  it("hydrates guest context", () => {
    useAccessStore.getState().hydrateFromContext({
      mode: "guest",
      isReadOnly: false,
      daysRemaining: 7,
    });

    const state = useAccessStore.getState();
    expect(state.initialized).toBe(true);
    expect(state.mode).toBe("guest");
    expect(state.daysRemaining).toBe(7);
  });

  it("hydrates registered context with plan", () => {
    useAccessStore.getState().hydrateFromContext({
      mode: "registered",
      userId: "user-1",
      isReadOnly: false,
      daysRemaining: null,
      plan: "plus",
    });

    const state = useAccessStore.getState();
    expect(state.mode).toBe("registered");
    expect(state.plan).toBe("plus");
  });
});
