# Domain Model (v0.2)

Phase 3 working document. Vocabulary is defined in `/CONTEXT.md`; this file holds **relationships, invariants and areas**, which the glossary deliberately excludes. Items tagged **[?Rn-Qm]** are open questions in grilling round n.

## Areas

Three areas that change for different reasons. Whether they become separate modules is a Phase 5 decision.

| Area | Owns | Changes when |
|---|---|---|
| **Catalog** | Champion, Archetype, Lane, Patch, Focus Champion | Riot ships a champion or patch; the user re-classifies |
| **Knowledge** | Source, Insight, Conflict, General Concept, Matchup sections, Verdict | Claude or the user curates content |
| **Statistics** | Collected match totals, Third-party References, statistical difficulty | The collector runs; the user records a LoLalytics number |

Knowledge and Statistics both *refer to* Catalog entities but never to each other's internals. A Matchup page is where they meet.

## Entities & relationships

```
Champion ──1 Primary Archetype, 0..1 Secondary Archetype
Focus Champion = (Champion, Lane)               e.g. (Orianna, Mid)
Matchup = {Champion A, Champion B} + Lane     (unordered; ≥1 is a Focus Champion of that Lane — ADR 0002)
  ├── 22 (Mid) or 21 (Bot) single-topic Sections in 7 groups (D13.1; some lane-conditional)
  │     └── links to 0..n General Concepts
  ├── 0..n Insights (each in exactly one Section, tagged about: A | B | both)
  ├── 0..1 Verdict (Me)
  └── Statistics (own totals + Third-party References)
Archetype Matchup = (Archetype, Archetype, Lane)
  ├── Insights (authored)
  └── computed figures (aggregated by Primary Archetype)
General Concept ── Insights (no Patch), "Applied in" ← Matchup Sections
Insight ── exactly 1 Source, 0..1 Patch, noted date, link + locator, review status (Unreviewed | Reviewed)
Verdict ── difficulty 1–5, confidence low|medium|high, notes, Patch
Conflict ── links 2 Insights with the same subject + Section
```

## Invariants

| # | Rule | Status |
|---|---|---|
| I1 | Every Insight has exactly one Source and a noted date. | Decided (D2.4, D4.3) |
| I2 | Matchup and champion Insights carry a Patch. General Concept Insights never do. | Decided (D4.3) |
| I3 | An Insight is a paraphrase. Any quote is short, and every external Insight has a link (+ timestamp for video). | Decided (D2.1) |
| I4 | At least one champion of a Matchup is a Focus Champion of that Matchup's Lane. | Decided (D5.1) |
| I5 | A Matchup's two champions are different; {A, B} and {B, A} in the same Lane are the same Matchup. | Decided (D5.1) |
| I6 | Sections "Roaming" and "Map pressure" exist only for Mid; "Support influence" only for Bot. | Decided (D3.6, D13.1) |
| I7 | Statistics only ever cover Emerald+ games. | Decided (D3.2) |
| I8 | A statistic below the minimum sample (100 games) is shown as "insufficient data", never as a number. | Decided (D3.10) |
| I9 | Own statistics and Third-party References are never combined into one figure. | Decided (D4.6) |
| I10 | Statistical difficulty and Verdict are never blended. | Decided (D3.5) |
| I11 | Computed Archetype Matchup figures count each champion under its Primary Archetype only. | Decided (D2.3) |
| I12 | Conflicting Insights are both kept and shown; neither is hidden or overridden. | Decided (D2.4) |
| I13 | Unreviewed Insights are displayed with an "Unreviewed" badge; rejected Insights are deleted. | Decided (D5.4) |
| I14 | No player identifiers (PUUIDs) are ever stored. | Decided (D3.12) |
| I15 | Every Matchup Insight is tagged with the side it is about (A, B or both). | Decided (D5.2) |
| I16 | Each champion has exactly one Primary Archetype and at most one Secondary Archetype, from the approved list. | Decided (D5.8) |
| I17 | A Conflict links exactly two Insights with the same subject and Section, and is created explicitly. | Decided (D5.7) |
| I18 | Computed Archetype Matchup figures use all collected games in the Lane. | Decided (D5.6) |
| I19 | A Bot Matchup's champions are whoever played the Bot position, regardless of Archetype. | Decided (D5.3) |
