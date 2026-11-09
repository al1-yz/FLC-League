# 01: Walking skeleton: one Matchup on screen

**What to build:** The app starts locally with one command and reads its Content Repository location from local configuration (falling back to the public demo content). It loads one Matchup file against a fixture Catalog and shows that Matchup's Insights grouped under the fixed Sections in template order, each credited with Source, link, Patch and noted date. A bare persistent sidebar and Riot's "not endorsed" notice are visible on every page; base dark theme tokens exist; the unit and end-to-end test runners are set up. Spec: US1 (partial), FR-005, FR-006, FR-015, FR-026a. See `specs/001-matchup-knowledge-base/` (plan, data-model, contracts).

**Blocked by:** None (can start immediately)

**Status:** done (awaiting user review)

- [x] App starts locally and opens on localhost without network access
- [x] Content Repository location comes from local configuration; without it the demo content is used
- [x] A Matchup file in the documented format renders with its Insights under the correct Sections in template order
- [x] Each Insight shows Source name, link, Patch and noted date
- [x] Riot "not endorsed" notice is on every page
- [x] Unit and end-to-end test runners execute at least one passing test each
- [x] No collected third-party content is added to the public repository

## Comments

- 2026-11-09 (Claude): Implemented test-first at the agreed test points. S1: Vitest `tests/content/matchup-view.test.ts` through `loadKnowledgeBase` → `kb.matchup`. S2: Playwright `tests/e2e/study-matchup.spec.ts` (page, Section order, credited Insight with timestamped link, sidebar, Riot notice). The demo-content fallback was verified manually. Validation rules are deferred to ticket 03 by design.
