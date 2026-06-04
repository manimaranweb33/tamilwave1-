import { test, expect } from "@playwright/test";

test.describe("Admin panel", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  });

  test("unauthenticated admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
