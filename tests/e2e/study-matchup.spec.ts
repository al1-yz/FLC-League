import { expect, test } from "@playwright/test";

test("landing introduces FLC and the top bar leads to a Focus Champion", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FLC");
  await expect(page.getByText("Focus · Learn · Climb")).toBeVisible();
  await expect(page.getByText("Full Lane Control")).toBeVisible();

  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByText("Mid lane").hover();
  await nav.getByRole("link", { name: "Orianna" }).click();
  await expect(page).toHaveURL(/\/mid\/orianna$/);
});

test("champion page shows the capsule readings and its Matchups", async ({ page }) => {
  await page.goto("/mid/orianna");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna");
  await expect(page.getByText("Control Mage")).toBeVisible();
  await page.getByRole("link", { name: /vs Syndra/ }).click();
  await expect(page).toHaveURL(/\/mid\/matchup\/orianna--syndra\?as=orianna/);
});

test("user studies a Matchup as an analysis sheet with credited coach notes", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna vs Syndra");
  expect(await page.getByRole("heading", { level: 2 }).allTextContents()).toEqual([
    "Analysis of the game plan",
    "Details",
    "Lane section · levels 1–18",
    "Coach notes",
    "Statistics",
  ]);
  const sectionTitles = await page.getByRole("heading", { level: 3 }).allTextContents();
  expect(sectionTitles).toHaveLength(16);
  expect(sectionTitles.some((t) => t.includes("Wave management"))).toBe(false);

  const note = page.getByRole("article").filter({ hasText: "Syndra wins short trades" });
  await expect(note).toContainText("Coach Curtis");
  await expect(note).toContainText("16.22");
  await expect(note.getByRole("link")).toHaveAttribute("href", /watch\?v=example/);

  await expect(page.getByRole("navigation", { name: "Main" })).toContainText("Mid lane");
  await expect(page.getByRole("contentinfo")).toContainText("isn't endorsed by Riot Games");
});

test("the statistics prototype is clearly marked as sample data", async ({ page }) => {
  await page.goto("/prototype/stats?champion=orianna");

  await expect(page.getByText("Prototype · sample data only")).toBeVisible();
  await expect(page.getByRole("img", { name: "Influence map of opponents" })).toBeVisible();
});
