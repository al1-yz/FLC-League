# 12: Archetype Matchup pages

**What to build:** An Archetype Matchup page (e.g. Assassin vs Control Mage, Mid) shows authored Insights credited like Matchup Insights, the champions of each Archetype by Primary Archetype, links to the user's existing Matchups between them, and a "not yet available" area for computed figures (feature 002). Spec: US8, FR-034.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Authored Insights shown credited
- [x] Champions listed by Primary Archetype only; unclassified excluded
- [x] Links to existing Matchups between the two Archetypes
- [x] Computed figures area says "not yet available" with no numbers

## Comments

- 2026-11-11 (Claude): Archetype Matchup files (`archetype-matchups/<lane>/<a>--<b>.yaml`) are validated (R-LANE, R-ARCH, R-PAIR, plus the common Insight checks). Pages: `/archetypes` index and `/archetypes/<lane>/<pair>` with principles, champions per Primary Archetype, related Matchups and a "not yet available" computed area. Linked from the top bar.
