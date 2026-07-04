import { test, expect } from "@playwright/test";

const GUEST_COOKIE_NAME = "toribird_guest_started_at";

test("guest cookie shows trial badge on today page", async ({ page, context }) => {
  await context.addCookies([
    {
      name: GUEST_COOKIE_NAME,
      value: new Date().toISOString(),
      url: "http://localhost:3100",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/");
  await expect(page.getByText(/あと\d+日無料/)).toBeVisible();
});
