# 02: Catalog refresh from Data Dragon

**What to build:** A command run outside the app refreshes the Catalog from Riot's Data Dragon (latest version; champions, items, runes and champion icons) into the Content Repository. The app then shows real champion names and icons, the current Patch (first two parts of the Data Dragon version) and the date of the last refresh. This is the only code that uses the network. Spec: FR-001, FR-001a, FR-002, R5 in research.

**Blocked by:** #01

**Status:** done (awaiting user review)

- [x] Running the refresh command prints the Data Dragon version found and the number of champions
- [x] Catalog and icons are written only into the Content Repository's catalog area
- [x] The app shows the current Patch and last refresh date
- [x] Champion icons display offline; a missing icon falls back to the champion name
- [x] Data Dragon `16.22.1` maps to Patch `16.22`

## Comments

- 2026-11-09 (Claude): Done early for the splash backgrounds (D13.3). Also downloads splash art for Focus Champions using `config/skins.yaml`; reports unknown skin names with the available list. Verified by running it against the private content repo (16.22.1, 173 champions, Dark Star Orianna found). No unit test: the only test point is the network call, which we agreed not to fake.
