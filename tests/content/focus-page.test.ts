import { cpSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";
import { recordVerdict } from "@/user-data";

function copyOf(fixture: string) {
  const dir = mkdtempSync(join(tmpdir(), "flc-focus-"));
  cpSync(fixture, dir, { recursive: true });
  return dir;
}

describe("Focus Champion Matchup table", () => {
  it("summarises each Matchup with Opponent Archetype, latest Verdict, Insight and Unreviewed counts", () => {
    const dir = copyOf("tests/content/fixtures/baseline");
    recordVerdict(dir, "mid/orianna--syndra", { difficulty: 4, confidence: "high", notes: "" });
    mkdirSync(join(dir, "champions"), { recursive: true });
    writeFileSync(join(dir, "champions", "syndra.yaml"), "primaryArchetype: control-mage\n");

    expect(loadKnowledgeBase(dir).kb.matchupsFor("orianna", "mid")).toEqual([
      expect.objectContaining({
        key: "mid/orianna--syndra",
        opponentArchetype: "Control Mage",
        verdict: 4,
        insights: 1,
        unreviewed: 1,
      }),
    ]);
  });

  it("lists a Matchup that only has a Verdict, and opens Matchups that have no content yet", () => {
    const dir = copyOf("tests/content/fixtures/baseline");
    const { kb: before } = loadKnowledgeBase(dir);

    const empty = before.matchup("mid/akali--orianna", "orianna");
    expect(empty.groups.flatMap((g) => g.sections).every((s) => s.insights.length === 0)).toBe(true);

    recordVerdict(dir, "mid/akali--orianna", { difficulty: 2, confidence: "low", notes: "" });
    expect(loadKnowledgeBase(dir).kb.matchupsFor("orianna", "mid").map((m) => m.key)).toContain("mid/akali--orianna");
  });

  it("refuses Matchups that can't exist", () => {
    const { kb } = loadKnowledgeBase("tests/content/fixtures/baseline");
    expect(() => kb.matchup("mid/syndra--unknown", "syndra")).toThrow();
  });

  it("lists every Catalog champion for the Matchup search", () => {
    const { kb } = loadKnowledgeBase("tests/content/fixtures/baseline");
    expect(kb.champions().map((c) => c.id)).toEqual(expect.arrayContaining(["akali", "syndra", "zed"]));
  });
});
