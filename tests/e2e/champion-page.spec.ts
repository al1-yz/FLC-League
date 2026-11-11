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

test("Archetype Matchups are reachable from the top bar and show principles and champions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Archetypes" }).click();
  await page.getByRole("link", { name: /Assassin vs Control Mage/ }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Assassin vs Control Mage");
  await expect(page.getByText("Assassins want to fight before the control mage gets its first item.")).toBeVisible();
  await expect(page.getByRole("region", { name: "Assassin" }).getByRole("link", { name: "Akali" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Control Mage" }).getByRole("link", { name: "Orianna" })).toBeVisible();
  await expect(page.getByText("Not yet available")).toBeVisible();
});

test("the radial graph colours Opponents by one signal and opens their Matchups", async ({ page }) => {
  await page.goto("/mid/akali");
  await expect(page.getByRole("table")).toBeVisible();

  await page.getByRole("button", { name: "Graph" }).click();
  const graph = page.getByRole("img", { name: "Akali's matchups as a radial graph" });
  await expect(graph).toBeVisible();
  await expect(graph).toContainText("no verdict");

  await page.getByLabel("Colour by").selectOption("statistical");
  await expect(graph).toContainText("n/a");

  await graph.getByRole("link", { name: "vs Zed" }).click();
  await expect(page).toHaveURL(/\/mid\/matchup\/akali--zed\?as=akali/);
});
