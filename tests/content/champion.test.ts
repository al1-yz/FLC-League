import { describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";

describe("Champion lookup", () => {
  it("returns a Catalog champion's name, and falls back to the id for unknown champions", () => {
    const { kb } = loadKnowledgeBase("tests/content/fixtures/baseline");

    expect(kb.champion("syndra")).toMatchObject({ id: "syndra", name: "Syndra" });
    expect(kb.champion("unknown")).toMatchObject({ id: "unknown", name: "unknown" });
  });
});

describe("Catalog", () => {
  it("reports the current Patch from the Catalog", () => {
    const { kb } = loadKnowledgeBase("tests/content/fixtures/baseline");

    expect(kb.currentPatch()).toBe("16.22");
  });
});
