import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

describe("Opponent page", () => {
  const { kb, report } = loadKnowledgeBase("tests/content/fixtures/rich");

  it("shows Archetypes, credited champion-level Insights and every Matchup involving the champion", () => {
    const zed = kb.opponent("zed");

    expect(zed).toMatchObject({ name: "Zed", primaryArchetype: "Assassin" });
    expect(zed.insights).toEqual([expect.objectContaining({ id: "zed-curve", source: { id: "coach-a", name: "Coach A" }, patch: "16.22" })]);
    expect(zed.matchups.map((m) => m.key)).toEqual(["mid/akali--zed"]);
  });

  it("rejects champion Insights without a Patch", () => {
    expect(report.issues).toContainEqual(expect.objectContaining({ file: "champions/zed.yaml", entryId: "zed-no-patch", rule: "R-PATCH" }));
  });

  it("says when a champion has no Archetype yet", () => {
    expect(kb.opponent("orianna").primaryArchetype).toBeUndefined();
  });
});
