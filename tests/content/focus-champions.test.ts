import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

describe("Focus Champions", () => {
  it("lists each Lane's Focus Champions from configuration, with Catalog names", () => {
    const { kb } = loadKnowledgeBase("tests/content/fixtures/baseline");

    expect(kb.focusChampions("mid")).toEqual([
      { id: "akali", name: "Akali", lane: "mid" },
      { id: "orianna", name: "Orianna", lane: "mid" },
      { id: "zed", name: "Zed", lane: "mid" },
    ]);
  });
});
