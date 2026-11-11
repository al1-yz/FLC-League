# Data Model: Matchup Knowledge Base (001)

Phase 1 of `/speckit-plan`. Terms are defined in `CONTEXT.md`, and invariants `I*` in `docs/domain/model.md`. The on-disk format is specified in [contracts/content-format.md](contracts/content-format.md); this file describes the **in-memory domain model** the Content module returns.

## Identifiers

- **ChampionId**: Data Dragon champion `id`, lower-cased (e.g. `orianna`, `kaisa`).
- **Patch**: `"<major>.<minor>"` string (e.g. `"16.22"`), compared numerically per part.
- **MatchupKey**: `<lane>/<a>--<b>`, where `a < b` alphabetically, so it's the same key in either order (I5). Example: `mid/orianna--syndra`.
- **InsightId**: globally unique string, chosen by the writer (e.g. `mid-orianna-syndra-0007`).
- **SectionId**: one of `overview, difficulty, win-conditions, support-influence, power-spikes, early-game, mid-game, late-game, trading-patterns, trading-stance, cooldown-windows, all-in-windows, kill-windows, defensive-windows, runes, summoner-spells, itemization, statistics` (D13.1, D15.1), grouped as in FR-015.

## Entities

| Entity | Fields | Rules |
|---|---|---|
| **Catalog** | currentPatch, refreshedAt, champions{id, name, iconPath}, items{id, name}, runes{id, name} | currentPatch = latest catalog version (FR-002) |
| **Archetype** | id, name | from `config/archetypes.yaml` |
| **ChampionProfile** | championId, primaryArchetype?, secondaryArchetype?, species? (lore, from a Source; not in Riot game data), insights[] (champion-level) | archetypes from the approved list; secondary ≠ primary (I16); unclassified allowed (FR-003) |
| **FocusChampion** | championId, lane | from `config/focus-champions.yaml` (FR-004) |
| **Source** | id, name, kind (`official`, `third-party-statistic`, `coaching`, `me`), homeLink, medium (`video`, `article`, `podcast`, `data`, `other`) | `me` is built in and can't be redefined |
| **Insight** | id, subject (see below), sourceId, claim, quote?, link, locator?, patch?, noted, collectedBy (`claude`, `user`), reviewStatus (derived) | I1, I2, I3; locator required when the Source medium is `video`; quote ≤ 200 characters, one sentence |
| **Insight.subject** | `{matchup: MatchupKey, section, about: ChampionId or "both", spike?: {level} or {item}}` or `{champion}` or `{concept}` or `{archetypeMatchup}` | patch required unless `concept` (I2); `about` must be one of the two champions (I15); `spike` only in `power-spikes` (FR-016); section must be allowed for the lane (I6) |
| **Matchup** | key, lane, champions [a, b], insights[], references[], verdicts[], meNotes[] | ≥1 Focus Champion of the lane (I4); a ≠ b (I5) |
| **ThirdPartyReference** | id, sourceId, link, forChampion, rankFilter (`emerald_plus`, `diamond_plus`, `master_plus`), patches (one Patch or a {from, to} range), games, winRate?, extra{label: value}, recorded | rank ≥ Emerald (I7); below 100 games the figures are shown as insufficient data (I8); never combined with other figures (I9) |
| **Conflict** | id, insightIds [x, y], flaggedBy (`claude`, `user`) | same subject and section, x ≠ y, both exist (I17) |
| **Verdict** | matchupKey, patch, difficulty 1–5, confidence (`low`, `medium`, `high`), notes, recordedAt | at most one per (matchup, patch); the latest Patch is used in tables and the graph (FR-022a) |
| **MeNote** | id, target (`{matchup, section}` or `{concept}`), text, createdAt, updatedAt | Source is always `me` |
| **GeneralConcept** | id, name, summary?, insights[], appliedIn[] (derived from the section→concept map) | Insights have no Patch (I2) |
| **SectionConceptMap** | section → conceptIds[] | from `config/section-concepts.yaml` (FR-019) |
| **ArchetypeMatchup** | key `<lane>/<archA>--<archB>`, insights[] | computed figures are out of scope for 001 (FR-034) |
| **ValidationReport** | issues[{file, path, entryId?, rule, message}] | invalid entries are excluded from the model (FR-008, FR-009) |

## Derived state

- **reviewStatus**: `unreviewed` when `collectedBy = claude` and the id isn't in `me/review.yaml` approvals; otherwise `reviewed` (I13).
- **possiblyOutdated**: `insight.patch < catalog.currentPatch` (FR-020).
- **Perspective**: a view of a Matchup from one of its Focus Champions. Insights `about` that champion go under "you", about the other under "Opponent", and `both` under shared (FR-017).
- **Matchups listed for a Focus Champion**: every Matchup that has at least one Insight, MeNote, Verdict or Reference (spec Assumptions).

## State transitions

```
Insight (collectedBy=claude):  unreviewed ──approve──▶ reviewed
                                    └──────reject──────▶ deleted (Conflicts containing it are removed too)
Insight (collectedBy=user):    reviewed (no review needed)
Verdict:  none ──record(patch P)──▶ Verdict@P ──edit on P──▶ Verdict@P (replaced)
                                           └──record on P' > P──▶ Verdict@P' (Verdict@P kept as history)
```
