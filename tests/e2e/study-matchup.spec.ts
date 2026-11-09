import { expect, test } from "@playwright/test";

test("user studies a Matchup's credited Insights, grouped in template order", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna vs Syndra");

  expect(await page.getByRole("heading", { level: 2 }).allTextContents()).toEqual([
    "Game timeline",
    "Timeline details",
    "Overview",
    "Trading",
    "Windows",
    "Build",
    "General Concepts",
    "Statistics",
  ]);
  const sectionTitles = await page.getByRole("heading", { level: 3 }).allTextContents();
  expect(sectionTitles.slice(0, 4)).toEqual(["Power spikes", "Early game", "Mid game", "Late game"]);
  expect(sectionTitles).toHaveLength(22);
  expect(sectionTitles).toEqual(expect.arrayContaining(["Wave management", "Lane priority", "Roaming", "Map pressure"]));

  const insight = page.getByRole("article").filter({ hasText: "Syndra wins short trades" });
  await expect(insight).toContainText("Coach Curtis");
  await expect(insight).toContainText("16.22");
  await expect(insight.getByRole("link")).toHaveAttribute("href", /watch\?v=example/);

  await expect(page.getByRole("navigation")).toContainText("Mid");
  await expect(page.getByRole("contentinfo")).toContainText("isn't endorsed by Riot Games");
});
