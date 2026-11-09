# 03: Full content validation and report page

**What to build:** Loading content enforces every load rule from the content-format contract (R-SRC, R-PATCH, R-QUOTE, R-FOCUS, R-PAIR, R-SECTION, R-RANK, R-ABOUT, R-ARCH, R-CONFLICT, R-LANE, R-ID, R-CHAMP). Invalid entries are never displayed, and a validation report page lists each one with file, location, entry id, rule and a plain-language message. Spec: US2, FR-008–FR-013, FR-038, FR-041, invariants I1–I8, I15–I17, I19.

**Blocked by:** #01

**Status:** ready-for-agent

- [ ] Each rule has a fixture with exactly that violation and a test asserting the report entry
- [ ] A test fails if any rule lacks a fixture (SC-006)
- [ ] Invalid entries are excluded while valid entries in the same file still load
- [ ] Report page shows file, location, entry id, rule and message
- [ ] General Concept Insights without a Patch are accepted; Matchup Insights without one are rejected
