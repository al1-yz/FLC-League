# 11: Opponent pages

**What to build:** An Opponent page shows the champion's name and icon, Primary and optional Secondary Archetype (or "Archetype not classified"), champion-level Insights, and links to every Matchup involving that champion. Spec: US7, FR-003, FR-032.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Archetypes shown, or "Archetype not classified"
- [x] Champion-level Insights shown credited with Patch
- [x] All Matchups involving the champion are linked

## Comments

- 2026-11-11 (Claude): `kb.opponent(id)` returns the profile (Archetypes, species), validated champion-level Insights (which share R-ID/R-SRC/R-PATCH/R-QUOTE with Matchup Insights via `checkCommon`) and every Matchup involving the champion. The page is at `/opponents/<id>`, linked from the Opponent name on Matchup pages.
