"use server";

import { revalidatePath } from "next/cache";
import { contentDir } from "@/content/config";
import { deleteMeNote, recordVerdict, saveMeNote, type Confidence } from "@/user-data";

/** Server actions for the user's own data on a Matchup (FR-022, FR-023). Live reload refreshes other tabs. */
export async function recordVerdictAction(formData: FormData) {
  const matchup = String(formData.get("matchup"));
  recordVerdict(contentDir(), matchup, {
    difficulty: Number(formData.get("difficulty")),
    confidence: String(formData.get("confidence")) as Confidence,
    notes: String(formData.get("notes") ?? ""),
  });
  revalidatePath("/", "layout");
}

export async function saveMeNoteAction(formData: FormData) {
  const id = formData.get("id");
  saveMeNote(
    contentDir(),
    { matchup: String(formData.get("matchup")), section: String(formData.get("section")) },
    String(formData.get("text") ?? ""),
    id ? String(id) : undefined,
  );
  revalidatePath("/", "layout");
}

export async function deleteMeNoteAction(formData: FormData) {
  deleteMeNote(contentDir(), String(formData.get("id")));
  revalidatePath("/", "layout");
}
