import type { Verdict } from "@/content";

/**
 * The user's Verdict on a Matchup (FR-022, FR-022a): the latest one prominently, a quick form to
 * record or update it for the current Patch, and earlier Patches as history. Never mixed with statistics.
 */
export function VerdictPanel({
  matchup,
  verdict,
  action,
}: {
  matchup: string;
  verdict?: { latest: Verdict; history: Verdict[] };
  action: (formData: FormData) => Promise<void>;
}) {
  const latest = verdict?.latest;
  return (
    <section aria-labelledby="verdict-title" className="legible">
      <h2 id="verdict-title" className="sheet__title">Your verdict</h2>
      <form action={action} className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-end">
        <input type="hidden" name="matchup" value={matchup} />
        <fieldset>
          <legend className="mb-2 text-[0.82rem] uppercase tracking-[0.25em] text-ink-faint">Difficulty</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="verdict-dot" title={["Free lane", "Comfortable", "Even", "Hard", "Survival mode"][n - 1]}>
                <input type="radio" name="difficulty" value={n} defaultChecked={latest?.difficulty === n} required className="sr-only" />
                <span>{n}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-faint">1 free lane · 5 survival mode</p>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <label className="text-sm text-ink-muted">
            <span className="mb-2 block text-[0.82rem] uppercase tracking-[0.25em] text-ink-faint">Confidence</span>
            <select name="confidence" defaultValue={latest?.confidence ?? "medium"} className="field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            <span className="mb-2 block text-[0.82rem] uppercase tracking-[0.25em] text-ink-faint">Notes</span>
            <input name="notes" defaultValue={latest?.notes ?? ""} placeholder="What decided the lane?" className="field w-full" />
          </label>
        </div>
        <button type="submit" className="glass-pill justify-self-start">
          {latest ? "Update verdict" : "Record verdict"}
        </button>
      </form>

      {latest && (
        <p className="mt-5 text-sm text-ink-muted">
          <span className="text-blush-300">{latest.difficulty} / 5</span> · {latest.confidence} confidence · Patch {latest.patch} · {latest.recordedAt}
          {latest.notes && <span className="text-ink"> — {latest.notes}</span>}
        </p>
      )}
      {verdict && verdict.history.length > 0 && (
        <ul aria-label="Earlier verdicts" className="mt-3 space-y-1 text-sm text-ink-faint">
          {verdict.history.map((v) => (
            <li key={v.patch}>
              Patch {v.patch}: {v.difficulty} / 5 · {v.confidence} · {v.recordedAt}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
