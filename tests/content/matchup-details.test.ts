import { describe, expect, it } from "vitest";
import { loadKnowledgeBase, type MatchupView } from "@/content";

const rich = "tests/content/fixtures/rich";
const section = (view: MatchupView, id: string) => view.groups.flatMap((g) => g.sections).find((s) => s.id === id)!;

describe("Matchup perspective", () => {
  const { kb } = loadKnowledgeBase(rich);

  it("tags each Insight as yours, the Opponent's or shared, from the viewing Focus Champion", () => {
    const asAkali = kb.matchup("mid/akali--zed", "akali");
    const sides = Object.fromEntries(section(asAkali, "trading-patterns").insights.map((i) => [i.id, i.side]));
    expect(sides).toEqual({ "new-akali": "you", "old-zed": "opponent" });
    expect(section(asAkali, "overview").insights[0].side).toBe("shared");

    const asZed = kb.matchup("mid/akali--zed", "zed");
    expect(section(asZed, "trading-patterns").insights.find((i) => i.id === "old-zed")?.side).toBe("you");
  });

  it("offers a perspective switch only when both champions are Focus Champions of the Lane", () => {
    expect(kb.matchup("mid/akali--zed", "akali").switchTo).toBe("zed");
  });
});

describe("Patch freshness", () => {
  it("marks Insights from older Patches as possibly outdated and lists current ones first", () => {
    const { kb } = loadKnowledgeBase(rich);
    const trading = section(kb.matchup("mid/akali--zed", "akali"), "trading-patterns");

    expect(trading.insights.map((i) => [i.id, i.outdated])).toEqual([
      ["new-akali", false],
      ["old-zed", true],
    ]);
  });
});

describe("Conflicts", () => {
  it("pairs conflicting Insights within their Section, neither ranked first", () => {
    const { kb } = loadKnowledgeBase(rich);
    const windows = section(kb.matchup("mid/akali--zed", "akali"), "all-in-windows");

    expect(windows.conflicts).toEqual([["lvl3-a", "lvl3-b"]]);
  });
});

describe("Power spikes", () => {
  it("groups power-spike Insights by level, then by item, then the rest", () => {
    const { kb } = loadKnowledgeBase(rich);
    const spikes = section(kb.matchup("mid/akali--zed", "akali"), "power-spikes");

    expect(spikes.spikeGroups?.map((g) => [g.label, g.insights.map((i) => i.id)])).toEqual([
      ["Level 2", ["spike-2-akali"]],
      ["Level 6", ["spike-6-zed"]],
      ["Zhonya's Hourglass", ["spike-zhonya"]],
      ["General", ["spike-general"]],
    ]);
  });
});
