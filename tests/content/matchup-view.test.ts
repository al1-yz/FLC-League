import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

const baseline = "tests/content/fixtures/baseline";

describe("Matchup view", () => {
  it("groups a Mid Matchup's Sections in template order, with credited Insights", () => {
    const { kb } = loadKnowledgeBase(baseline);

    const view = kb.matchup("mid/orianna--syndra", "orianna");

    expect(view.groups.map((g) => [g.id, g.sections.map((s) => s.id)])).toEqual([
      ["overview", ["overview", "difficulty", "win-conditions"]],
      ["timeline", ["power-spikes", "early-game", "mid-game", "late-game"]],
      ["trading", ["trading-patterns", "trading-stance", "cooldown-windows"]],
      ["windows", ["all-in-windows", "kill-windows", "defensive-windows"]],
      ["build", ["runes", "summoner-spells", "itemization"]],
      ["statistics", ["statistics"]],
    ]);
    const trading = view.groups.flatMap((g) => g.sections).find((s) => s.id === "trading-patterns");
    expect(trading?.insights).toEqual([
      expect.objectContaining({
        id: "mid-orianna-syndra-0001",
        claim: expect.stringContaining("Syndra wins short trades"),
        source: { id: "coach-curtis", name: "Coach Curtis" },
        link: "https://www.youtube.com/watch?v=example",
        locator: "07:42",
        patch: "16.22",
        noted: "2026-11-09",
      }),
    ]);
  });
});

it("gives a Bot Matchup Support influence, which Mid does not have", () => {
  const { kb } = loadKnowledgeBase(baseline);

  const ids = kb.matchup("bot/ezreal--kaisa", "ezreal").groups.flatMap((g) => g.sections.map((s) => s.id));

  expect(ids).toContain("support-influence");
  expect(ids).toHaveLength(18);
});

it("keeps General Concepts out of the Matchup template (they have their own pages)", () => {
  const { kb } = loadKnowledgeBase(baseline);

  const ids = kb.matchup("mid/orianna--syndra", "orianna").groups.flatMap((g) => g.sections.map((s) => s.id));

  expect(ids).toHaveLength(17);
  for (const concept of ["tethering", "wave-management", "lane-priority", "roaming", "map-pressure"]) {
    expect(ids).not.toContain(concept);
  }
});
