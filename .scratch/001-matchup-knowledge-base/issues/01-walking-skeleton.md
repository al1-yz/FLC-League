# 01: Walking skeleton: one Matchup on screen

**What to build:** The app starts locally with one command and reads its Content Repository location from local configuration (falling back to the public demo content). It loads one Matchup file against a fixture Catalog and shows that Matchup's Insights grouped under the fixed Sections in template order, each credited with Source, link, Patch and noted date. A bare persistent sidebar and Riot's "not endorsed" notice are visible on every page; base dark theme tokens exist; the unit and end-to-end test runners are set up. Spec: US1 (partial), FR-005, FR-006, FR-015, FR-026a. See `specs/001-matchup-knowledge-base/` (plan, data-model, contracts).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] App starts locally and opens on localhost without network access
- [ ] Content Repository location comes from local configuration; without it the demo content is used
- [ ] A Matchup file in the documented format renders with its Insights under the correct Sections in template order
- [ ] Each Insight shows Source name, link, Patch and noted date
- [ ] Riot "not endorsed" notice is on every page
- [ ] Unit and end-to-end test runners execute at least one passing test each
- [ ] No collected third-party content is added to the public repository
