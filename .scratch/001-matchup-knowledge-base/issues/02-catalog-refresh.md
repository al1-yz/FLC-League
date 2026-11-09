# 02: Catalog refresh from Data Dragon

**What to build:** A command run outside the app refreshes the Catalog from Riot's Data Dragon (latest version; champions, items, runes and champion icons) into the Content Repository. The app then shows real champion names and icons, the current Patch (first two parts of the Data Dragon version) and the date of the last refresh. This is the only code that uses the network. Spec: FR-001, FR-001a, FR-002, R5 in research.

**Blocked by:** #01

**Status:** ready-for-agent

- [ ] Running the refresh command prints the Data Dragon version found and the number of champions
- [ ] Catalog and icons are written only into the Content Repository's catalog area
- [ ] The app shows the current Patch and last refresh date
- [ ] Champion icons display offline; a missing icon falls back to the champion name
- [ ] Data Dragon `16.22.1` maps to Patch `16.22`
