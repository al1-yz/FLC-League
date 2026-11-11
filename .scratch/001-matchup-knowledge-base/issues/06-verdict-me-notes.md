# 06: Verdict and Me notes

**What to build:** On any Matchup the user records a Verdict (difficulty 1–5, confidence low/medium/high, notes); the current Patch and date are stored automatically. One Verdict per Patch: editing on the same Patch replaces it, a newer Patch creates a new one and earlier ones stay as visible history. The user adds, edits and deletes Me notes in any Section. All of it is written only to the user's own data area of the Content Repository, survives restarts, and is displayed apart from external Insights and statistics. Spec: US3, FR-022, FR-022a, FR-023, FR-026, FR-026b.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Verdict saved with current Patch and date and survives restart
- [x] Same-Patch edit replaces; newer-Patch Verdict keeps the older one in history
- [x] Latest Verdict shown prominently with history list
- [x] Me notes credited to "Me" and visually distinct from external Insights
- [x] Writes never touch Claude-collected files; writes are atomic
- [x] Verdict and statistical difficulty are never combined
- [x] End-to-end test "record a Verdict" passes

## Comments

- 2026-11-11 (Claude): UserData module (`recordVerdict`, `saveMeNote`, `deleteMeNote`) writes atomically to `me/verdicts.yaml` and `me/notes.yaml` only, and is tested through its interface in temporary copies of the fixture (same-Patch replace, history on a newer Patch, 1–5 guard, ownership). The Matchup page has a Verdict panel (difficulty dots, confidence, notes, history) and per-Section Me notes via server actions. A browser test records both and checks they survive a reload. Me notes on General Concepts come with ticket 10.
