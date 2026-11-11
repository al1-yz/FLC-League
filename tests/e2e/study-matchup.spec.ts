import { expect, test } from "@playwright/test";

test("user studies a Matchup as a step-by-step game plan with credited Insights", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna vs Syndra");

  expect(await page.getByRole("heading", { level: 2 }).allTextContents()).toEqual([
    "Read the lane",
    "Know the spikes",
    "Early game",
    "Trade",
    "Pick your windows",
    "Mid game",
    "Late game",
    "Build for it",
    "Matchup analysis",
  ]);
  const sectionTitles = await page.getByRole("heading", { level: 3 }).allTextContents();
  expect(sectionTitles).toHaveLength(16);
  expect(sectionTitles).not.toContain("Wave management");

  const insight = page.getByRole("article").filter({ hasText: "Syndra wins short trades" }).last();
  await expect(insight).toContainText("Coach Curtis");
  await expect(insight).toContainText("16.22");
  await expect(insight.getByRole("link")).toHaveAttribute("href", /watch\?v=example/);

  await expect(page.getByRole("navigation", { name: "Game plan" })).toContainText("Step 1");
  await expect(page.getByRole("contentinfo")).toContainText("isn't endorsed by Riot Games");
});

test("the statistics prototype is clearly marked as sample data", async ({ page }) => {
  await page.goto("/prototype/stats?champion=orianna");

  await expect(page.getByText("Prototype · sample data only")).toBeVisible();
  await expect(page.getByRole("img", { name: "Influence map of opponents" })).toBeVisible();
});
