# 03: Full content validation and report page

**What to build:** Loading content enforces every load rule from the content-format contract (R-SRC, R-PATCH, R-QUOTE, R-FOCUS, R-PAIR, R-SECTION, R-RANK, R-ABOUT, R-ARCH, R-CONFLICT, R-LANE, R-ID, R-CHAMP). Invalid entries are never displayed, and a validation report page lists each one with file, location, entry id, rule and a plain-language message. Spec: US2, FR-008–FR-013, FR-038, FR-041, invariants I1–I8, I15–I17, I19.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Each rule has a fixture with exactly that violation and a test asserting the report entry
- [x] A test fails if any rule lacks a fixture (SC-006)
- [x] Invalid entries are excluded while valid entries in the same file still load
- [x] Report page shows file, location, entry id, rule and message
- [x] General Concept Insights without a Patch are accepted; Matchup Insights without one are rejected

## Comments

- 2026-11-11 (Claude): Implemented test-first. S1: `tests/content/validation.test.ts` loads a `broken` fixture with exactly one planted violation per rule (two for R-SRC and R-ARCH), checks every report entry, checks that nothing beyond the planted issues is reported, that valid entries in the same file still load, and that a rule-coverage table fails if a rule has no case (SC-006). S2: Playwright test for `/validation` and the top-bar issue count, using a dedicated e2e fixture with one planted R-PATCH issue. Added R-SHAPE for malformed entries (documented in the contract). Third-party References and Conflicts are now parsed and validated; displaying them is tickets 13 and 04/09. Concept and Archetype Matchup rules arrive with tickets 10 and 12. The user's private content repo validates clean.
