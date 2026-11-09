# 06: Verdict and Me notes

**What to build:** On any Matchup the user records a Verdict (difficulty 1–5, confidence low/medium/high, notes); the current Patch and date are stored automatically. One Verdict per Patch: editing on the same Patch replaces it, a newer Patch creates a new one and earlier ones stay as visible history. The user adds, edits and deletes Me notes in any Section. All of it is written only to the user's own data area of the Content Repository, survives restarts, and is displayed apart from external Insights and statistics. Spec: US3, FR-022, FR-022a, FR-023, FR-026, FR-026b.

**Blocked by:** #01

**Status:** ready-for-agent

- [ ] Verdict saved with current Patch and date and survives restart
- [ ] Same-Patch edit replaces; newer-Patch Verdict keeps the older one in history
- [ ] Latest Verdict shown prominently with history list
- [ ] Me notes credited to "Me" and visually distinct from external Insights
- [ ] Writes never touch Claude-collected files; writes are atomic
- [ ] Verdict and statistical difficulty are never combined
- [ ] End-to-end test "record a Verdict" passes
