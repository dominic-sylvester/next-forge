import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/next-forge|app/i);
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("Authentication Pages", () => {
  test("should load sign-in page", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should load sign-up page", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("API Health Check", () => {
  test("should return OK from health endpoint", async ({ request }) => {
    const response = await request.get("http://localhost:3002/health");
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toBe("OK");
  });
});
