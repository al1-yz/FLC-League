import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

describe("Archetype Matchups", () => {
  const { kb, report } = loadKnowledgeBase("tests/content/fixtures/arch");

  it("shows authored Insights, champions by Primary Archetype and existing Matchups between them", () => {
    const view = kb.archetypeMatchup("mid/assassin--control-mage");

    expect(view.archetypes.map((a) => [a.name, a.champions.map((c) => c.id)])).toEqual([
      ["Assassin", ["akali"]],
      ["Control Mage", ["orianna"]],
    ]);
    expect(view.insights.map((i) => i.id)).toEqual(["arch-1"]);
    expect(view.matchups).toEqual(["mid/akali--orianna"]);
  });

  it("lists Archetype Matchups that have content", () => {
    expect(kb.archetypeMatchups().map((a) => a.key)).toEqual(["mid/assassin--control-mage"]);
  });

  it("validates Archetype Matchup files", () => {
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ file: "archetype-matchups/mid/assassin--control-mage.yaml", entryId: "arch-bad", rule: "R-PATCH" }),
        expect.objectContaining({ file: "archetype-matchups/mid/assassin--wizard.yaml", rule: "R-ARCH" }),
      ]),
    );
  });
});
