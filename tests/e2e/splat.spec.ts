import { expect, test } from "@playwright/test";

test("handles 404s", async ({ page }) => {
  const res = await page.goto("./not-found");

  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Oops!/i })).toBeVisible();
});

test("shows home link on direct visit", async ({ page }) => {
  await page.goto("./not-found");
  // There should be a home link, not a back button
  await expect(page.getByRole("link", { name: /Go home/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Go home/i })).toHaveAttribute("href", "/");
  await expect(page.getByRole("button", { name: /Go back/i })).not.toBeVisible();
});
