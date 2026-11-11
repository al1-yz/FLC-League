import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readList, writeList } from "./files";

export type Result = { ok: true } | { ok: false; reason: string };
export type Confidence = "low" | "medium" | "high";
export type VerdictRecord = { matchup: string; patch: string; difficulty: number; confidence: Confidence; notes: string; recordedAt: string };
export type NoteTarget = { matchup: string; section: string } | { concept: string };
export type MeNoteRecord = { id: string; target: NoteTarget; text: string; createdAt: string; updatedAt: string };

const date = (now: Date) => now.toISOString().slice(0, 10);
const currentPatch = (dir: string): string =>
  (JSON.parse(readFileSync(join(dir, "catalog", "catalog.json"), "utf8")) as { currentPatch: string }).currentPatch;

/**
 * Records the user's Verdict on a Matchup for the current Patch (FR-022): replaces the Verdict of the
 * same Patch, keeps Verdicts of older Patches as history.
 */
export function recordVerdict(
  dir: string,
  matchup: string,
  input: { difficulty: number; confidence: Confidence; notes: string },
  now = new Date(),
): Result {
  if (!Number.isInteger(input.difficulty) || input.difficulty < 1 || input.difficulty > 5)
    return { ok: false, reason: "Difficulty must be a whole number from 1 to 5." };
  if (!["low", "medium", "high"].includes(input.confidence)) return { ok: false, reason: "Confidence must be low, medium or high." };
  const patch = currentPatch(dir);
  const others = readList<VerdictRecord>(dir, "verdicts.yaml").filter((v) => !(v.matchup === matchup && v.patch === patch));
  writeList(dir, "verdicts.yaml", [...others, { matchup, patch, ...input, notes: input.notes.trim(), recordedAt: date(now) }]);
  return { ok: true };
}

/** Adds a Me note, or edits it when `id` is given (FR-023). */
export function saveMeNote(dir: string, target: NoteTarget, text: string, id?: string, now = new Date()): Result & { id?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, reason: "A note can't be empty." };
  const notes = readList<MeNoteRecord>(dir, "notes.yaml");
  if (id) {
    const existing = notes.find((n) => n.id === id);
    if (!existing) return { ok: false, reason: "That note no longer exists." };
    writeList(dir, "notes.yaml", notes.map((n) => (n.id === id ? { ...n, text: trimmed, updatedAt: date(now) } : n)));
    return { ok: true, id };
  }
  const note: MeNoteRecord = { id: randomUUID(), target, text: trimmed, createdAt: date(now), updatedAt: date(now) };
  writeList(dir, "notes.yaml", [...notes, note]);
  return { ok: true, id: note.id };
}

export function deleteMeNote(dir: string, id: string): Result {
  const notes = readList<MeNoteRecord>(dir, "notes.yaml");
  if (!notes.some((n) => n.id === id)) return { ok: false, reason: "That note no longer exists." };
  writeList(dir, "notes.yaml", notes.filter((n) => n.id !== id));
  return { ok: true };
}
