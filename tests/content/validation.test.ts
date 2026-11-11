import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

const broken = "tests/content/fixtures/broken";

/**
 * One case per load rule (contracts/content-format.md). Each names where the violation lives.
 * A rule missing from this table fails the build (SC-006).
 */
const RULE_CASES: Record<string, { file: string; entryId?: string }[]> = {
  "R-SRC": [
    { file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-source" },
    { file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-locator" },
  ],
  "R-PATCH": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-patch" }],
  "R-QUOTE": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-quote" }],
  "R-FOCUS": [{ file: "matchups/mid/ahri--syndra.yaml" }],
  "R-PAIR": [{ file: "matchups/mid/zed--ahri.yaml" }],
  "R-SECTION": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-section" }],
  "R-RANK": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "ref-gold" }],
  "R-ABOUT": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "bad-about" }],
  "R-ARCH": [{ file: "champions/zed.yaml" }, { file: "champions/akali.yaml" }],
  "R-CONFLICT": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "conflict-bad" }],
  "R-LANE": [{ file: "matchups/mid/akali--zed.yaml" }],
  "R-ID": [{ file: "matchups/mid/orianna--syndra.yaml", entryId: "ok-trading" }],
  "R-CHAMP": [{ file: "matchups/mid/orianna--yasuo.yaml" }],
};

const ALL_RULES = ["R-SRC", "R-PATCH", "R-QUOTE", "R-FOCUS", "R-PAIR", "R-SECTION", "R-RANK", "R-ABOUT", "R-ARCH", "R-CONFLICT", "R-LANE", "R-ID", "R-CHAMP"];

describe("Content validation", () => {
  const { kb, report } = loadKnowledgeBase(broken);

  it("has a test case for every load rule", () => {
    expect(Object.keys(RULE_CASES).sort()).toEqual([...ALL_RULES].sort());
  });

  it.each(Object.entries(RULE_CASES))("reports every %s violation with its file and entry", (rule, cases) => {
    for (const c of cases) {
      expect(report.issues).toContainEqual(
        expect.objectContaining({ rule, file: c.file, ...(c.entryId && { entryId: c.entryId }), message: expect.any(String) }),
      );
    }
  });

  it("reports nothing beyond the planted violations", () => {
    const planted = Object.values(RULE_CASES).flat().length;
    expect(report.issues).toHaveLength(planted);
  });

  it("keeps valid entries and hides invalid ones in the same file", () => {
    const ids = kb
      .matchup("mid/orianna--syndra", "orianna")
      .groups.flatMap((g) => g.sections.flatMap((s) => s.insights.map((i) => i.id)));

    expect(ids.sort()).toEqual(["ok-early", "ok-trading", "ok-trading-2"]);
  });

  it("drops files that break a file-level rule", () => {
    expect(kb.matchupsFor("ahri", "mid")).toEqual([]);
    expect(kb.matchupsFor("orianna", "mid").map((m) => m.key)).toEqual(["mid/orianna--syndra"]);
  });

  it("ignores invalid Archetypes instead of showing them", () => {
    expect(kb.profile("zed").primaryArchetype).toBeUndefined();
    expect(kb.profile("akali")).toMatchObject({ primaryArchetype: "Assassin", secondaryArchetype: undefined });
  });

  it("finds no issues in valid content", () => {
    expect(loadKnowledgeBase("tests/content/fixtures/baseline").report.issues).toEqual([]);
  });
});
