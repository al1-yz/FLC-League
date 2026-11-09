# 08: Radial graph view

**What to build:** The Focus Champion page gets a table/graph toggle (table remains the default). The graph places the Focus Champion in the center and Opponents around it, colored by one difficulty signal at a time — Verdict by default, switchable to statistical — with neutral nodes where the signal is missing. Clicking a node opens the Matchup. Spec: FR-029, FR-030.

**Blocked by:** #07

**Status:** ready-for-agent

- [ ] Table is the default view; toggle switches to graph and back
- [ ] Nodes colored by the selected signal only; never a blend
- [ ] Nodes without the selected signal are neutral
- [ ] Clicking a node opens that Matchup from the Focus Champion's perspective
