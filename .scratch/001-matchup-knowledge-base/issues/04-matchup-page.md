# 04: Complete Matchup page

**What to build:** The Matchup page becomes the full study view: shown from the perspective of the Focus Champion it was opened from (with a switch when both are Focus Champions), Insights placed by side (you / Opponent / both), Conflicts side by side with no ranking, "possibly outdated" markers for Insights older than the current Patch (current-Patch Insights first), Power spikes grouped by level 1–18 and by item, gap markers for empty Sections, and lane-conditional Sections (Roaming only Mid, Support influence only Bot). Spec: US1, FR-015–FR-018, FR-020, FR-021.

**Blocked by:** #01

**Status:** ready-for-agent

- [ ] Mid Matchup shows 14 Sections in template order; Bot Matchup shows its 21
- [ ] Perspective follows the Focus Champion opened from; switch available when both are Focus Champions
- [ ] Insights tagged about the Opponent appear as Opponent information
- [ ] Conflicting Insights appear side by side, labeled, neither ranked above the other
- [ ] Older-Patch Insights show "possibly outdated" with their Patch, listed after current-Patch ones
- [ ] Power spikes are grouped by level and by item
- [ ] Empty Sections show a gap marker
- [ ] End-to-end test "study a Matchup" passes
