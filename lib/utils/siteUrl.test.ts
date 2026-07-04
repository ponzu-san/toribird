import { describe, expect, it } from "vitest";
import { buildAuthCallbackUrl } from "@/lib/utils/siteUrl";

describe("buildAuthCallbackUrl", () => {
  it("builds callback URL with encoded next path", () => {
    expect(buildAuthCallbackUrl("http://localhost:3100", "/reset-password")).toBe(
      "http://localhost:3100/auth/callback?next=%2Freset-password",
    );
  });

  it("defaults next to root", () => {
    expect(buildAuthCallbackUrl("https://example.vercel.app")).toBe(
      "https://example.vercel.app/auth/callback?next=%2F",
    );
  });
});
