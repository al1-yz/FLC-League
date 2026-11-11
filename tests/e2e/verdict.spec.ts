import { rmSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.afterEach(() => rmSync("tests/e2e/fixtures/content/me", { recursive: true, force: true }));

test("user records a Verdict and a Me note after a game, and both persist", async ({ page }) => {
  await page.goto("/mid/matchup/orianna--syndra?as=orianna");

  const verdict = page.getByRole("region", { name: "Your verdict" });
  await verdict.locator("label.verdict-dot").filter({ hasText: "4" }).click();
  await verdict.getByLabel("Confidence").selectOption("medium");
  await verdict.getByLabel("Notes").fill("Lost lane pre-6.");
  await verdict.getByRole("button", { name: "Record verdict" }).click();

  await expect(verdict).toContainText("4 / 5 · medium confidence · Patch 16.22");
  await expect(verdict).toContainText("Lost lane pre-6.");

  const trading = page.locator("#trading-patterns");
  await trading.getByText("+ Add your note").click();
  await trading.getByLabel("Your note on Trading patterns").fill("Walk up only when her E is down.");
  await trading.getByRole("button", { name: "Save" }).click();
  await expect(trading.getByRole("list", { name: "Your notes on Trading patterns" })).toContainText("Walk up only when her E is down.");

  await page.reload();
  await expect(page.getByRole("region", { name: "Your verdict" })).toContainText("4 / 5");
  await expect(page.locator("#trading-patterns")).toContainText("Walk up only when her E is down.");
});
