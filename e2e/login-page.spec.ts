import { test, expect } from "@playwright/test";

test("login page shows auth helper links", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  await expect(page.getByRole("link", { name: "パスワードをお忘れの方" })).toHaveAttribute(
    "href",
    "/login/forgot-password",
  );
  await expect(page.getByRole("link", { name: "メールアドレスをお忘れの方" })).toHaveAttribute(
    "href",
    "/login/forgot-email",
  );
});

test("forgot email page shows guidance steps", async ({ page }) => {
  await page.goto("/login/forgot-email");
  await expect(page.getByRole("heading", { name: "メールアドレスをお忘れの方" })).toBeVisible();
  await expect(page.getByText("登録確認メールを探す")).toBeVisible();
});
