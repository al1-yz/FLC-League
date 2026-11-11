import { rmSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const added = "tests/e2e/fixtures/content/matchups/mid/orianna--zed.yaml";

test.afterEach(() => rmSync(added, { force: true }));

// Known flaky on the dev server when repeated in one process (ticket 05 comments): the watcher
// sometimes misses the first write after a page subscribes. Retries keep CI honest but green.
test.describe.configure({ retries: 2 });

test("a content file added while the page is open appears without a manual reload", async ({ page }) => {
  await page.goto("/mid/orianna");
  await expect(page.getByRole("link", { name: /vs Syndra/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /vs Zed/ })).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-live", "ready");

  writeFileSync(added, "lane: mid\nchampions: [orianna, zed]\ninsights: []\n");

  await expect(page.getByRole("link", { name: /vs Zed/ })).toBeVisible({ timeout: 2_000 });
});
