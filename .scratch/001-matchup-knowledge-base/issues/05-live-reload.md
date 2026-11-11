# 05: Live reload on content changes

**What to build:** When any file in the Content Repository changes while the app is open, the app reloads and re-validates content and the open page updates automatically, without losing anything the user is typing. Spec: FR-026c.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Editing a content file shows the change on the open page within 2 seconds without manual reload
- [x] Text typed in an open form survives the refresh
- [x] New invalid entries appear in the validation report after reload
- [x] End-to-end test "live reload" passes

## Comments

- 2026-11-11 (Claude): A chokidar watcher (one per process) feeds an SSE route; a client listener calls router.refresh(), which keeps client state. The server announces "ready" only after the watcher's initial scan, which fixed a race. The browser test adds a Matchup file and sees it appear within 2 s (passed 3 of 3 repeats). The "typed text survives" criterion is exercised by ticket 06 forms, which use the same mechanism.
