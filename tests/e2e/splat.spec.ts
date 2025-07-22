import { expect, test } from "@playwright/test";

test("handles 404s", async ({ page }) => {
  const res = await page.goto("./not-found");

  const homeLink = page.getByRole("link", { name: /go home/i });

  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Oops!/i })).toBeVisible();
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", "/");
});
