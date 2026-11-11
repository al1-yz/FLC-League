import { expect, test } from "@playwright/test";

test("the Focus Champion table sorts by any column and lists Matchups between Focus Champions", async ({ page }) => {
  await page.goto("/mid/akali");

  const table = page.getByRole("table");
  await expect(table).toContainText("vs Syndra");
  await expect(table).toContainText("vs Zed");

  await table.getByRole("button", { name: "Insights" }).click();
  await table.getByRole("button", { name: /Insights/ }).click();
  await expect(table.getByRole("row").nth(1)).toContainText("vs Zed");
  await expect(table.getByRole("columnheader", { name: /Insights/ })).toHaveAttribute("aria-sort", "descending");

  await page.goto("/mid/zed");
  await expect(page.getByRole("table")).toContainText("vs Akali");
});

test("searching an opponent opens an empty Matchup ready for a Verdict", async ({ page }) => {
  await page.goto("/mid/orianna");

  await page.getByLabel("Find a matchup against").fill("Zed");
  await page.getByRole("button", { name: "Open", exact: true }).click();

  await expect(page).toHaveURL(/\/mid\/matchup\/orianna--zed\?as=orianna/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orianna vs Zed");
  await expect(page.getByRole("button", { name: "Record verdict" })).toBeVisible();
  await expect(page.getByText("Awaiting coach notes.").first()).toBeVisible();
});

test("an Opponent page shows Archetype, traits and Matchups, reached from a Matchup", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");
  await page.getByRole("link", { name: "Syndra", exact: true }).click();

  await expect(page).toHaveURL(/\/opponents\/syndra$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Syndra");
  await expect(page.getByText("Archetype not classified")).toBeVisible();
  await expect(page.getByRole("link", { name: /Syndra vs Orianna/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Syndra vs Akali/ })).toBeVisible();
});
