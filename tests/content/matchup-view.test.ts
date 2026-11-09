import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

const baseline = "tests/content/fixtures/baseline";

describe("Matchup view", () => {
  it("shows a Mid Matchup's Sections in template order with credited Insights", () => {
    const { kb } = loadKnowledgeBase(baseline);

    const view = kb.matchup("mid/orianna--syndra", "orianna");

    expect(view.sections.map((s) => s.id)).toEqual([
      "overview",
      "win-conditions",
      "power-spikes",
      "phase-advantage",
      "trading",
      "tethering",
      "cooldown-windows",
      "all-in-windows",
      "defensive-windows",
      "wave-and-priority",
      "runes-and-spells",
      "itemization",
      "roaming",
      "statistics",
    ]);
    const trading = view.sections.find((s) => s.id === "trading");
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
