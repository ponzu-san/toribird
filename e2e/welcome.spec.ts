import { test, expect } from "@playwright/test";

test("welcome page shows trial CTA", async ({ page }) => {
  await page.goto("/welcome");
  await expect(page.getByRole("heading", { name: /毎日30秒で/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "7日間無料で試す" })).toBeVisible();
});

test("guest trial redirects to today page", async ({ page }) => {
  await page.goto("/welcome");
  await page.getByRole("button", { name: "7日間無料で試す" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("paragraph").filter({ hasText: /^今日$/ })).toBeVisible();
});
