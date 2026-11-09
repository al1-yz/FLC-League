import { expect, test } from "@playwright/test";

test("user studies a Matchup's credited Insights in template order", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna vs Syndra");

  const sectionTitles = await page.getByRole("heading", { level: 2 }).allTextContents();
  expect(sectionTitles.slice(0, 5)).toEqual([
    "Overview & difficulty",
    "Win conditions",
    "Power spikes",
    "Early, mid & late game",
    "Trading patterns & stance",
  ]);
  expect(sectionTitles).toHaveLength(14);

  const insight = page.getByRole("article").filter({ hasText: "Syndra wins short trades" });
  await expect(insight).toContainText("Coach Curtis");
  await expect(insight).toContainText("16.22");
  await expect(insight.getByRole("link")).toHaveAttribute("href", /watch\?v=example/);

  await expect(page.getByRole("navigation")).toContainText("Mid");
  await expect(page.getByRole("contentinfo")).toContainText("isn't endorsed by Riot Games");
});
