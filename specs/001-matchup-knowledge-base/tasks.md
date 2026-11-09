---

description: "Task list for 001 Matchup Knowledge Base"
---

# Tasks: Matchup Knowledge Base

**Input**: Design documents from `/specs/001-matchup-knowledge-base/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-format.md, contracts/modules.md, quickstart.md

**Tests**: INCLUDED. Constitution VII requires every invariant to be covered by a test through module interfaces.

**Organization**: Tasks are grouped by user story. Note: implementation tickets will be produced by Matt Pocock's `to-tickets` (vertical slices, D1.1); this file exists to feed `/speckit-analyze` and as a checklist reference.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story from spec.md (US1–US9)

## Phase 1: Setup

- [ ] T001 Initialize Next.js 16 (App Router, TypeScript version supported by Next 16) project at repository root with `package.json` scripts `dev`, `start`, `test`, `test:e2e`, `catalog:refresh`, `schema:generate`
- [ ] T002 [P] Add dependencies `zod@4`, `yaml@2.9`, `chokidar@6`, `d3@7`, `tailwindcss@4` and dev dependencies `vitest@5`, `@playwright/test@1.65` in `package.json`
- [ ] T003 [P] Configure Tailwind 4 theme tokens (dark background, glass panel, teal accent, difficulty scale 1–5 + neutral) in `src/theme/tokens.css` per `docs/design/reference-direction.webp`
- [ ] T004 [P] Configure Vitest in `vitest.config.ts` and Playwright in `playwright.config.ts`
- [ ] T005 [P] Add `.env.local` to `.gitignore` and read `LOLMECHS_CONTENT_DIR` (fallback `./demo-content`) in `src/content/config.ts`

---

## Phase 2: Foundational (blocks all stories)

- [ ] T006 Define domain types (ChampionId, Patch, MatchupKey with sorted pair `<lane>/<a>--<b>`, SectionId list of 15 in template order, Lane `mid|bot`) in `src/content/domain.ts`
- [ ] T007 Implement Patch parsing/comparison (`"<major>.<minor>"`, numeric per part; Data Dragon `16.22.1` → `16.22`) in `src/content/patch.ts`
- [ ] T008 [P] Write Zod schemas for every file type in contracts/content-format.md — Insight `quote` "≤ 200 chars, one sentence"; `patch` "required for matchup, champion and archetype Insights; forbidden for concepts"; `locator` "required when the Source medium is video"; `rankFilter` "emerald_plus | diamond_plus | master_plus"; `spike` "only in power-spikes" — in `src/content/schemas.ts`
- [ ] T009 Implement catalog reader for `catalog/catalog.json` (currentPatch, refreshedAt, champions, items, runes) in `src/content/catalog.ts`
- [ ] T010 Implement `loadKnowledgeBase(contentDir)` — parse YAML, shape-validate, apply cross-entity rules R-SRC, R-PATCH, R-QUOTE, R-FOCUS, R-PAIR, R-SECTION, R-RANK, R-ABOUT, R-ARCH, R-CONFLICT, R-LANE, R-ID, R-CHAMP, exclude invalid entries, return `{kb, report}` in `src/content/load.ts`
- [ ] T011 Implement process-level cache keyed by content dir with `invalidate()` in `src/content/cache.ts`
- [ ] T012 [P] Create fixture content folders (one valid baseline + one folder per rule violation) in `tests/content/fixtures/`
- [ ] T013 Write rule-coverage test: table of rule ids → fixture → expected report entry; fails if any rule lacks a fixture (SC-006) in `tests/content/rules.test.ts`
- [ ] T014 [P] Build app shell: sidebar (Lanes → Focus Champions, Archetypes, Opponents, General Concepts), Riot "not endorsed" notice on every page, current Patch + last refresh date (FR-001a, FR-005, FR-028) in `src/app/layout.tsx`
- [ ] T015 [P] Create catalog refresh CLI: Data Dragon versions.json → champion.json, item.json, runesReforged.json, square icons → `catalog/` of the content repo; prints version found (FR-001) in `scripts/catalog-refresh.ts`

**Checkpoint**: content loads and validates; shell renders.

---

## Phase 3: User Story 1 — Study a Matchup (P1) 🎯 MVP

**Goal**: Orianna vs Syndra readable end-to-end. **Independent test**: quickstart V2.

- [ ] T016 [P] [US1] Test `kb.matchup(key, perspective)`: 14 Mid sections in template order, gap markers, `about` → you/Opponent/shared, outdated flag, current-Patch first, Conflict pairs, in `tests/content/matchup-view.test.ts`
- [ ] T017 [US1] Implement `matchup(key, perspective)` view building (FR-015–FR-021), Power spikes grouped by level 1–18 and by item (FR-016) in `src/content/views/matchup.ts`
- [ ] T018 [P] [US1] Build Insight card (claim, optional quote, Source name, link with timestamp, Patch, noted date, Unreviewed and possibly-outdated badges) in `src/ui/InsightCard.tsx`
- [ ] T019 [P] [US1] Build side-by-side Conflict component with no ranking (FR-021) in `src/ui/ConflictPair.tsx`
- [ ] T020 [US1] Build Matchup page with `?as=<champion>` perspective and perspective switch when both are Focus Champions (FR-017) in `src/app/[lane]/matchup/[pair]/page.tsx`
- [ ] T021 [US1] Section → General Concept links from `config/section-concepts.yaml` (FR-019) in `src/content/views/matchup.ts`
- [ ] T022 [US1] Write a small user-authored example Matchup (Me notes and placeholder Insights only, NO collected third-party content, per constitution V and FR-026a) in `demo-content/matchups/mid/orianna--syndra.yaml`
- [ ] T022a [US1] Collect real Orianna vs Syndra content: Claude researches approved Sources (`docs/discovery/sources-shortlist.md`) and writes credited, paraphrased Insights covering all 14 Mid sections plus ≥1 Conflict and ≥1 LoLalytics Third-party Reference; the user reviews (SC-001) in the PRIVATE content repo `matchups/mid/orianna--syndra.yaml`
- [ ] T023 [US1] Playwright flow "study a Matchup" (V2) in `tests/e2e/study-matchup.spec.ts`

---

## Phase 4: User Story 2 — Add content the app can read (P1)

**Goal**: Claude can produce valid content from docs alone. **Independent test**: quickstart V3, V4.

- [ ] T024 [P] [US2] Implement Zod → JSON Schema generation (`z.toJSONSchema`) to `docs/content-schema/*.json` in `scripts/schema-generate.ts`
- [ ] T025 [US2] Write content format guide with one complete example per file type (FR-007) in `docs/content-format.md`
- [ ] T026 [US2] Derive review status: `unreviewed` when `collectedBy = claude` and id not in `me/review.yaml` (I13) in `src/content/load.ts`
- [ ] T027 [US2] Build validation report page (file, path, entry id, rule, plain-language message; FR-009) in `src/app/validation/page.tsx`
- [ ] T028 [US2] Implement chokidar watcher singleton + SSE route emitting `changed`, invalidating cache (FR-026c) in `src/app/api/content-events/route.ts`
- [ ] T029 [US2] Client listener calling `router.refresh()` on `changed` without losing form state in `src/ui/LiveReload.tsx`
- [ ] T030 [US2] Playwright flow "live reload" (V3): change visible ≤ 2 s in `tests/e2e/live-reload.spec.ts`
- [ ] T030a [US2] Claude-authoring check (SC-008): Claude writes a new Matchup (e.g. Akali vs Sylas) using only `docs/content-format.md` and the JSON Schema; it must load with zero validation errors within 2 attempts; record result in `specs/001-matchup-knowledge-base/quickstart.md`

---

## Phase 5: User Story 3 — Record Verdict and Me notes (P1)

**Goal**: post-game rating in < 30 s. **Independent test**: quickstart V5.

- [ ] T031 [P] [US3] Test UserData: `recordVerdict` "difficulty 1–5, confidence low|medium|high", one per (matchup, patch), same-Patch replace, new Patch keeps history; `saveMeNote`/`deleteMeNote`; writes only under `me/` in `tests/user-data/verdicts-notes.test.ts`
- [ ] T032 [US3] Implement atomic YAML write helper (temp file + rename) in `src/user-data/write.ts`
- [ ] T033 [US3] Implement `recordVerdict`, `saveMeNote`, `deleteMeNote` (FR-022, FR-023, FR-026b) in `src/user-data/index.ts`
- [ ] T034 [US3] Load Verdicts and Me notes into the KnowledgeBase (latest Verdict + history, FR-022a) in `src/content/load.ts`
- [ ] T035 [US3] Verdict panel (latest + history list) and Me note editor as Server Actions on the Matchup page, shown apart from statistics (I10) in `src/ui/VerdictPanel.tsx`
- [ ] T036 [US3] Playwright flow "record a Verdict" (V5) in `tests/e2e/verdict.spec.ts`

---

## Phase 6: User Story 4 — Navigate champions and Matchups (P2)

**Independent test**: Mid → Akali, sort, switch to graph, open Matchup.

- [ ] T037 [P] [US4] Test `matchupsFor(focus, lane)`: lists Matchups with any content; Akali vs Zed on both pages; columns Opponent, Primary Archetype, Verdict difficulty, statistical difficulty "not available", Insight count, Unreviewed count in `tests/content/matchups-for.test.ts`
- [ ] T038 [US4] Implement `matchupsFor` in `src/content/views/focus.ts`
- [ ] T039 [US4] Sortable Matchup table (default view) in `src/ui/MatchupTable.tsx`
- [ ] T040 [US4] Radial graph (D3 layout math, React SVG), colored by one signal at a time, Verdict default, neutral when missing (FR-030) in `src/ui/RadialGraph.tsx`
- [ ] T041 [US4] Focus Champion page with table/graph toggle and champion search opening an empty Matchup (FR-029, FR-031) in `src/app/[lane]/[champion]/page.tsx`

---

## Phase 7: User Story 5 — Review Claude-collected Insights (P2)

**Independent test**: quickstart V6.

- [ ] T042 [P] [US5] Test `approveInsight`, `rejectInsight` (removes only that YAML entry and its Conflicts, preserves rest of file), `flagConflict` (refuses unless same subject and section, I17); and the UserData interface offers no operation that edits external Insight text (FR-027) in `tests/user-data/review.test.ts`
- [ ] T043 [US5] Implement `approveInsight`, `rejectInsight` (yaml Document API), `flagConflict` in `src/user-data/review.ts`
- [ ] T044 [US5] Implement `kb.unreviewed()` (FR-035) in `src/content/views/review.ts`
- [ ] T045 [US5] Review page with approve/reject/flag actions and refusal reasons in `src/app/review/page.tsx`

---

## Phase 8: User Story 6 — General Concepts (P2)

**Independent test**: quickstart V7.

- [ ] T046 [P] [US6] Test `concept(id)`: no Patch labels, noted dates, "Applied in" derived from section map, gap marker when empty in `tests/content/concept.test.ts`
- [ ] T047 [US6] Implement `concept()`/`concepts()` in `src/content/views/concept.ts`
- [ ] T048 [US6] Concept page with Me notes and "Applied in" links in `src/app/concepts/[concept]/page.tsx`
- [ ] T049 [US6] Write one user-authored example concept (no collected content) in `demo-content/concepts/`
- [ ] T049a [US6] Collect real content for Wave Management, Lane Priority and Roaming from approved Sources, with section links from Orianna vs Syndra (SC-002) in the PRIVATE content repo `concepts/`

---

## Phase 9: User Story 7 — Opponent pages (P3)

- [ ] T050 [P] [US7] Test `opponent(id)`: archetypes or "not classified", champion Insights, linked Matchups in `tests/content/opponent.test.ts`
- [ ] T051 [US7] Implement `opponent()` in `src/content/views/opponent.ts`
- [ ] T052 [US7] Opponent page in `src/app/opponents/[champion]/page.tsx`

---

## Phase 10: User Story 8 — Archetype Matchups (P3)

- [ ] T053 [P] [US8] Test `archetypeMatchup(key)`: authored Insights, champions per Primary Archetype, "not yet available" computed area in `tests/content/archetype.test.ts`
- [ ] T054 [US8] Implement `archetypeMatchup()` in `src/content/views/archetype.ts`
- [ ] T055 [US8] Archetype Matchup page in `src/app/archetypes/[lane]/[pair]/page.tsx`

---

## Phase 11: User Story 9 — Third-party References (P3)

- [ ] T056 [P] [US9] Test Statistics section: Source, link, rank filter, Patch or range label, games, recorded date; "< 100 games → insufficient data (N games)" (I8); never combined (I9); own stats "not available" in `tests/content/references.test.ts`
- [ ] T057 [US9] Implement Statistics section view in `src/content/views/matchup.ts`
- [ ] T058 [US9] Reference card component in `src/ui/ReferenceCard.tsx`

---

## Phase 12: Polish & Cross-Cutting

- [ ] T059 [P] Performance check: every page < 1 s with validation-slice content (SC-009), documented in `specs/001-matchup-knowledge-base/quickstart.md`
- [ ] T060 [P] Offline check (SC-010): no runtime network calls; assert in an e2e test in `tests/e2e/offline.spec.ts`
- [ ] T061 Write README (portfolio-facing: what, why, local setup, Riot notice, credit policy) in `README.md`
- [ ] T062 Run quickstart V1–V9 plus manual checks SC-003 (any existing Matchup in ≤ 3 clicks from launch) and SC-004 (Verdict recorded in < 30 s), and record results in `specs/001-matchup-knowledge-base/quickstart.md`

---

## Dependencies & Execution Order

- Setup (T001–T005) → Foundational (T006–T015) → user stories.
- US1, US2, US3 (P1) can proceed in parallel after Foundational; US2's T028–T029 benefit US3's form-preservation check.
- US4 needs US3 for Verdict column values (works with "—" otherwise). US5 needs T026. US6 independent. US7–US9 independent.
- Polish last.

## Parallel Examples

- Foundational: T008, T012, T014, T015 together.
- US1: T016, T018, T019 together, then T017 → T020.
- US3: T031 alongside T032.

## Implementation Strategy

1. **MVP** = Setup + Foundational + US1 (Orianna vs Syndra readable) — validate with V2.
2. Add US2 (Claude can write content) and US3 (Verdicts) → first real study use.
3. Then US4–US6, then US7–US9, then Polish.
