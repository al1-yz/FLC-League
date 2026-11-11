# 07: Focus Champion page and navigation

**What to build:** The sidebar provides Lane → Focus Champion → Matchups plus entries for Archetypes, Opponents and General Concepts. A Focus Champion page lists every Matchup with any content in a sortable table (Opponent, Opponent's Primary Archetype, latest Verdict difficulty, statistical difficulty "not available", Insight count, Unreviewed count). A search opens any Catalog champion as an empty Matchup where a Verdict can be recorded. A Matchup between two Focus Champions appears on both pages. Spec: US4, FR-004, FR-028, FR-029 (table), FR-031.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Sidebar shows Mid and Bot with their Focus Champions plus Archetypes, Opponents, General Concepts
- [x] Table lists exactly the Matchups with content, sortable by every column
- [x] Searching a champion without content opens an empty Matchup with gap markers
- [x] Akali vs Zed appears on both Akali's and Zed's pages from each perspective
- [x] Focus Champions come from configuration; adding one needs no code change

## Comments

- 2026-11-11 (Claude): Navigation is the top bar (D16.2), not a sidebar. The champion capsule page (D16.3) now has a sortable Matchup table (Opponent, Archetype, your Verdict, Statistical "not available", Insights, Unreviewed) and a search that opens an empty Matchup for any Catalog champion. A Matchup with only a Verdict or Me notes is listed too. Unreviewed counts Claude-collected Insights that are not in `me/review.yaml` (approval itself is ticket 09).
