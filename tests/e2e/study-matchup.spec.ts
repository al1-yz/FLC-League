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
    "Your verdict",
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

test("content problems are listed on the validation report and flagged in the top bar", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /1 content issue/ }).click();
  await expect(page).toHaveURL(/\/validation$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Content report");

  const issue = page.getByRole("listitem").filter({ hasText: "e2e-missing-patch" });
  await expect(issue).toContainText("matchups/mid/akali--syndra.yaml");
  await expect(issue).toContainText("R-PATCH");
  await expect(issue).toContainText("Patch like 16.22");
});

test("a Matchup between two Focus Champions shows sides, freshness, Conflicts and spikes", async ({ page }) => {
  await page.goto("/mid/matchup/akali--zed?as=akali");

  const older = page.getByRole("article").filter({ hasText: "Older claim about Zed." });
  await expect(older).toContainText("Zed");
  await expect(older).toContainText("Possibly outdated · 16.20");
  await expect(page.getByRole("article").filter({ hasText: "Current claim about Akali." })).toContainText("You");

  const conflict = page.getByRole("group", { name: "Conflicting coach notes" });
  await expect(conflict).toContainText("Zed wins the level 3 all-in.");
  await expect(conflict).toContainText("Akali wins the level 3 all-in.");

  const spikes = page.locator("#power-spikes");
  await expect(spikes).toContainText("Level 2");
  await expect(spikes).toContainText("Level 6");
  await expect(spikes).toContainText("Zhonya's Hourglass");

  await page.getByRole("link", { name: /See it as Zed/ }).click();
  await expect(page).toHaveURL(/as=zed/);
  await expect(page.getByRole("article").filter({ hasText: "Older claim about Zed." })).toContainText("You");
});
