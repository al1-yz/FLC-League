# Contract: Module Interfaces (001)

Uses the `codebase-design` vocabulary. Three **deep modules** carry the behaviour, behind small
interfaces. The UI calls only these interfaces. There's no speculative seam: the file system is the
only adapter, and tests use real temporary directories.

## Content module (read side)

```ts
loadKnowledgeBase(contentDir: string): { kb: KnowledgeBase; report: ValidationReport }
```

`KnowledgeBase` (queries only, no writes):

```ts
catalog(): Catalog
focusChampions(lane?): FocusChampion[]
matchupsFor(focus: ChampionId, lane: Lane): MatchupSummary[]   // table + graph rows (FR-029)
matchup(key: MatchupKey, perspective: ChampionId): MatchupView  // sections in template order (FR-015..021)
opponent(id: ChampionId): OpponentView
concept(id: ConceptId): ConceptView                            // includes appliedIn
concepts(): ConceptSummary[]
archetypeMatchup(key): ArchetypeMatchupView
unreviewed(): UnreviewedItem[]                                 // FR-035
```

- **Hides**: YAML parsing, Zod shapes, cross-entity rules, derived state (review status, outdated
  flags, perspective), section ordering, and lane-conditional sections.
- **Caching**: a process-level cache keyed by `contentDir`, cleared by the watcher.

## UserData module (write side, `me/` only)

```ts
recordVerdict(dir, key, input: {difficulty, confidence, notes}): Result   // patch = catalog.currentPatch
saveMeNote(dir, target, text, id?): Result
deleteMeNote(dir, id): Result
approveInsight(dir, insightId): Result
rejectInsight(dir, insightId): Result     // deletes from collected file + removes its Conflicts
flagConflict(dir, x, y): Result           // refuses unless I17 holds
```

- `Result` = `{ok: true}` or `{ok: false, reason}`, where `reason` is a plain-language message shown in the UI (FR-025).
- **Hides**: atomic file writes, YAML Document editing, and ownership rules.

## Catalog refresh (CLI)

```
npm run catalog:refresh   → prints "Catalog updated to 16.22 (Data Dragon 16.22.1), N champions"
```

This is the only code that touches the network. It writes only to `catalog/` in the content repository.

## Live reload

`GET /api/content-events` is a Server-Sent Events stream that emits `changed` whenever a file in the
content directory changes. A client component calls `router.refresh()` when it receives one.
