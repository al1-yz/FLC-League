# 08: Radial graph view

**What to build:** The Focus Champion page gets a table/graph toggle (table remains the default). The graph places the Focus Champion in the center and Opponents around it, colored by one difficulty signal at a time — Verdict by default, switchable to statistical — with neutral nodes where the signal is missing. Clicking a node opens the Matchup. Spec: FR-029, FR-030.

**Blocked by:** #07

**Status:** done (awaiting user review)

- [x] Table is the default view; toggle switches to graph and back
- [x] Nodes colored by the selected signal only; never a blend
- [x] Nodes without the selected signal are neutral
- [x] Clicking a node opens that Matchup from the Focus Champion's perspective

## Comments

- 2026-11-11 (Claude): Table/Graph toggle on the champion page (table default). Opponents sit around the Focus Champion on curved strands, coloured by one signal at a time: Verdict (lavender = easy, blush = hard) or Statistical (neutral "n/a" until feature 002); missing signals are neutral. Each node links to its Matchup. Browser-tested.
