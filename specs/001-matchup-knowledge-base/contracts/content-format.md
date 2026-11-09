# Contract: Content Repository Format (v1)

This is the contract Claude and the user write against, and the app reads (FR-006, FR-007). The
machine-readable version is the generated JSON Schema (`npm run schema:generate` →
`docs/content-schema/*.json` in the code repo). This document is the design-time contract. Once implemented, `docs/content-format.md` in the code
repo (task T025) becomes the single canonical guide, with one complete example per file type, and this
contract links to it rather than being maintained in parallel.

## Layout

```
<LOLMECHS_CONTENT_DIR>/
├── catalog/                     # written ONLY by `npm run catalog:refresh`
│   ├── catalog.json
│   ├── icons/<championId>.png
│   └── splash/<championId>.jpg   # Focus Champions only
├── config/                      # written by the user or Claude
│   ├── focus-champions.yaml
│   ├── skins.yaml               # splash-art skin per Focus Champion (exact Data Dragon name)
│   ├── archetypes.yaml
│   └── section-concepts.yaml
├── sources/<sourceId>.yaml
├── champions/<championId>.yaml          # archetypes + champion-level Insights
├── matchups/<lane>/<a>--<b>.yaml        # a < b alphabetically
├── concepts/<conceptId>.yaml
├── archetype-matchups/<lane>/<archA>--<archB>.yaml
└── me/                          # written ONLY by the app (user's own data)
    ├── verdicts.yaml
    ├── notes.yaml
    ├── review.yaml              # approved Insight ids
    └── conflicts.yaml           # Conflicts flagged by the user
```

**Ownership** (FR-026b): Claude writes everything except `catalog/` and `me/`. The app writes only
`me/`, plus deleting a rejected Insight from its collected file.

## Matchup file (example, abridged)

```yaml
lane: mid
champions: [orianna, syndra]
insights:
  - id: mid-orianna-syndra-0001
    section: trading-patterns
    about: syndra
    claim: >-
      Syndra wins short trades when her E (Scatter the Weak) is up: she can stun Orianna as
      soon as Orianna steps up to place her ball.
    quote: "Never walk into Syndra's E range while she has it."   # optional, ≤200 chars
    source: coach-curtis
    link: https://www.youtube.com/watch?v=XXXX
    locator: "07:42"           # required for video Sources
    patch: "16.22"
    noted: 2026-11-09
    collectedBy: claude
  - id: mid-orianna-syndra-0002
    section: power-spikes
    about: orianna
    spike: { level: 6 }        # or { item: "3285" }; only in power-spikes
    claim: "..."
    source: coach-mysterias
    link: https://...
    locator: "03:10"
    patch: "16.22"
    noted: 2026-11-09
    collectedBy: claude
references:
  - id: mid-orianna-syndra-ref-01
    source: lolalytics
    link: https://lolalytics.com/lol/orianna/vs/syndra/build/
    forChampion: orianna
    rankFilter: emerald_plus
    patches: "16.22"           # or { from: "16.20", to: "16.22" }
    games: 412
    winRate: 50.8
    extra: { "Delta vs average": "+0.6" }
    recorded: 2026-11-09
conflicts:
  - id: mid-orianna-syndra-c01
    insights: [mid-orianna-syndra-0001, mid-orianna-syndra-0005]
```

## Other file types (fields; full examples are produced in implementation)

- **sources/<id>.yaml**: `name`, `kind` (`official`, `third-party-statistic`, `coaching`), `medium` (`video`, `article`, `podcast`, `data`, `other`), `homeLink`.
- **champions/<id>.yaml**: `primaryArchetype?`, `secondaryArchetype?`, `insights[]`. Same insight fields, without `section`, `about` or `spike`; `patch` required.
- **concepts/<id>.yaml**: `name`, `summary?`, `insights[]`. Same fields, without `section`, `about`, `spike` or `patch` (I2).
- **archetype-matchups/...yaml**: `lane`, `archetypes: [a, b]`, `insights[]` (`patch` required).
- **config/focus-champions.yaml**: `mid: [akali, orianna, zed]`, `bot: [ezreal, kaisa, yunara]`.
- **config/archetypes.yaml**: list of `{id, name}`.
- **config/section-concepts.yaml**: `wave-management: [wave-management]`, `lane-priority: [lane-priority]`, `tethering: [trading]`, and so on.

## Validation rules applied on load

| Rule | Check | Ref |
|---|---|---|
| R-SRC | `source` exists; external Insights have `link`; `video` Sources require `locator` | I1, I3 |
| R-PATCH | `patch` required for matchup, champion and archetype Insights; forbidden for concepts; format `\d+\.\d+` | I2 |
| R-QUOTE | `quote` ≤ 200 chars, one sentence | I3 |
| R-FOCUS | at least one champion is a Focus Champion of `lane` | I4 |
| R-PAIR | champions differ; file name matches sorted pair; no duplicate Matchup | I5 |
| R-SECTION | section valid for the lane (`roaming` and `map-pressure` only mid, `support-influence` only bot) | I6 |
| R-RANK | `rankFilter` is Emerald or higher | I7 |
| R-ABOUT | `about` is one of the two champions or `both` | I15 |
| R-ARCH | archetypes exist in the list; secondary ≠ primary | I16 |
| R-CONFLICT | two existing, distinct Insights with the same subject and section | I17 |
| R-LANE | lane ∈ {mid, bot} | FR-041 |
| R-ID | Insight ids unique across the repository | — |
| R-CHAMP | every champion id exists in the catalog | edge case |

Each failure becomes a validation report entry `{file, path, entryId, rule, message}`, and the entry is excluded.
I8 and I9 are display rules, not load rules.
