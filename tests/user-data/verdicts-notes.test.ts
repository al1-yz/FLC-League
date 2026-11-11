import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { loadKnowledgeBase } from "@/content";
import { deleteMeNote, recordVerdict, saveMeNote } from "@/user-data";

let dir: string;
const KEY = "mid/orianna--syndra";
const day = (iso: string) => new Date(`${iso}T12:00:00Z`);

function setCurrentPatch(patch: string) {
  const path = join(dir, "catalog", "catalog.json");
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  writeFileSync(path, JSON.stringify({ ...catalog, currentPatch: patch }));
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "flc-userdata-"));
  cpSync("tests/content/fixtures/baseline", dir, { recursive: true });
});

describe("Verdicts", () => {
  it("records a Verdict with the current Patch and date, and the Matchup shows it", () => {
    expect(recordVerdict(dir, KEY, { difficulty: 4, confidence: "medium", notes: "Lost lane pre-6." }, day("2026-11-11"))).toEqual({ ok: true });

    const verdict = loadKnowledgeBase(dir).kb.matchup(KEY, "orianna").verdict;
    expect(verdict?.latest).toEqual({ patch: "16.22", difficulty: 4, confidence: "medium", notes: "Lost lane pre-6.", recordedAt: "2026-11-11" });
    expect(verdict?.history).toEqual([]);
  });

  it("replaces the Verdict on the same Patch, and keeps older Patches as history", () => {
    recordVerdict(dir, KEY, { difficulty: 4, confidence: "low", notes: "" }, day("2026-11-01"));
    recordVerdict(dir, KEY, { difficulty: 3, confidence: "medium", notes: "Better." }, day("2026-11-05"));
    setCurrentPatch("16.23");
    recordVerdict(dir, KEY, { difficulty: 2, confidence: "high", notes: "Easy now." }, day("2026-11-20"));

    const verdict = loadKnowledgeBase(dir).kb.matchup(KEY, "orianna").verdict!;
    expect(verdict.latest).toMatchObject({ patch: "16.23", difficulty: 2 });
    expect(verdict.history).toEqual([expect.objectContaining({ patch: "16.22", difficulty: 3, recordedAt: "2026-11-05" })]);
  });

  it("refuses difficulties outside 1–5 with a plain reason", () => {
    expect(recordVerdict(dir, KEY, { difficulty: 7, confidence: "low", notes: "" })).toEqual({ ok: false, reason: expect.stringContaining("1 to 5") });
  });
});

describe("Me notes", () => {
  it("adds, edits and deletes a Me note on a Matchup Section", () => {
    const target = { matchup: KEY, section: "trading-patterns" };
    expect(saveMeNote(dir, target, "Walk up only when E is down.", undefined, day("2026-11-11"))).toMatchObject({ ok: true, id: expect.any(String) });
    const id = loadKnowledgeBase(dir).kb.matchup(KEY, "orianna").groups.flatMap((g) => g.sections).find((s) => s.id === "trading-patterns")!.meNotes[0].id;

    saveMeNote(dir, target, "Walk up only when her E is down.", id, day("2026-11-12"));
    const notes = () => loadKnowledgeBase(dir).kb.matchup(KEY, "orianna").groups.flatMap((g) => g.sections).find((s) => s.id === "trading-patterns")!.meNotes;
    expect(notes()).toEqual([expect.objectContaining({ id, text: "Walk up only when her E is down.", createdAt: "2026-11-11", updatedAt: "2026-11-12" })]);

    expect(deleteMeNote(dir, id)).toEqual({ ok: true });
    expect(notes()).toEqual([]);
  });
});

describe("Ownership", () => {
  it("writes only inside me/ and leaves collected content untouched", () => {
    const before = readFileSync(join(dir, "matchups/mid/orianna--syndra.yaml"), "utf8");
    recordVerdict(dir, KEY, { difficulty: 3, confidence: "low", notes: "" });
    saveMeNote(dir, { matchup: KEY, section: "overview" }, "Note.");

    expect(readFileSync(join(dir, "matchups/mid/orianna--syndra.yaml"), "utf8")).toBe(before);
    expect(readdirSync(join(dir, "me")).sort()).toEqual(["notes.yaml", "verdicts.yaml"]);
    expect(existsSync(join(dir, "me", "verdicts.yaml.tmp"))).toBe(false);
  });
});
