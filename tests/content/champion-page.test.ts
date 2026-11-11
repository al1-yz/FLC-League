import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

const baseline = "tests/content/fixtures/baseline";

describe("Champion profile", () => {
  it("shows a champion's Archetypes and species from its profile", () => {
    const { kb } = loadKnowledgeBase(baseline);

    expect(kb.profile("orianna")).toMatchObject({
      name: "Orianna",
      primaryArchetype: "Control Mage",
      secondaryArchetype: undefined,
      species: "Fixture Species",
    });
    expect(kb.profile("akali")).toMatchObject({ primaryArchetype: "Assassin", secondaryArchetype: "Skirmisher" });
  });

  it("leaves Archetypes and species empty when no profile exists", () => {
    const { kb } = loadKnowledgeBase(baseline);

    expect(kb.profile("zed")).toMatchObject({ primaryArchetype: undefined, species: undefined });
  });
});

describe("Matchups of a Focus Champion", () => {
  it("lists every Matchup in the Lane that involves the champion, with its Opponent and Insight count", () => {
    const { kb } = loadKnowledgeBase(baseline);

    expect(kb.matchupsFor("orianna", "mid")).toEqual([
      expect.objectContaining({ key: "mid/orianna--syndra", opponent: expect.objectContaining({ id: "syndra" }), insights: 1 }),
    ]);
    expect(kb.matchupsFor("orianna", "bot")).toEqual([]);
  });
});
