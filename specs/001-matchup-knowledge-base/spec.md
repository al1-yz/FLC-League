# Feature Specification: Matchup Knowledge Base

**Feature Branch**: `001-matchup-knowledge-base`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "Matchup knowledge base (feature 001 of LoLMechs). A local-only, personal study app for League of Legends matchups (Emerald+ focus), for Mid and Bot lanes. [...] First validation slice: Orianna vs Syndra Matchup page fully filled, plus 2–3 General Concept pages." (full text in the specify invocation; authoritative inputs: `docs/discovery/decisions.md`, `docs/domain/model.md`, `CONTEXT.md`, `docs/domain/archetypes.md`, `docs/adr/`, `.specify/memory/constitution.md`)

Terms in **bold capitals** (Matchup, Insight, Source, …) are defined in `CONTEXT.md`. Invariants `I1`–`I19` refer to `docs/domain/model.md`.

## Clarifications

### Session 2026-11-09

- Q: Where should collected content, Verdicts and Me notes live? → A: In a separate private git repository (the content repository), configured by path; never in the public code repository.
- Q: When the Verdict is updated on a new Patch, is the old one kept? → A: One Verdict per Patch; edits within the same Patch replace it, older Patches are kept as history.
- Q: How does the app pick up content changes made while it is open, and avoid overwriting? → A: Auto-reload on change; the user's own data lives in separate files from Claude-collected content, so neither overwrites the other (rejecting an Insight is the only app write into collected content).
- Q: How is the Data Dragon catalog refreshed? → A: By a separate command run outside the app (by the user or Claude); the app only reads the resulting catalog.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study a Matchup before a game (Priority: P1)

Before or during champion select, the user opens the Matchup they are about to play (e.g. Orianna vs Syndra in Mid) and reads a structured guide: the overview, both champions' win conditions, power spikes by level and item, trading patterns, wave management and the other template sections. Every Insight shows who said it, where, and for which Patch. Where Sources disagree, both views appear side by side.

**Why this priority**: This is the core value of the product: understanding what happens in a Matchup, why, and how to respond. It is the first validation slice (D4.7).

**Independent Test**: Load the Orianna vs Syndra content and open the page. Every applicable section is shown in template order, each Insight is credited, and a planted Conflict is displayed side by side.

**Acceptance Scenarios**:

1. **Given** Orianna vs Syndra (Mid) has Insights, **When** the user opens it from Orianna, **Then** the page shows the 14 Mid sections in the fixed order (all template sections except "Support influence"), from Orianna's perspective.
2. **Given** an Insight from a video Source, **When** it is displayed, **Then** it shows the Source name, a link that opens the video at the stored timestamp, its Patch, and the date it was noted.
3. **Given** a section with no Insights, **When** the page is shown, **Then** that section is still displayed with a visible "no Source covers this yet" gap marker.
4. **Given** two Insights marked as a Conflict, **When** their section is shown, **Then** both appear next to each other, labeled as conflicting, each with its own credit, and neither is visually ranked above the other.
5. **Given** an Insight noted on a Patch older than the current Patch, **When** it is displayed, **Then** it carries a "possibly outdated" marker showing its Patch.
6. **Given** an Insight tagged as about Syndra, **When** the page is viewed from Orianna, **Then** it is presented as information about the Opponent (e.g. under Syndra's win conditions), not about Orianna.

---

### User Story 2 - Add content that the app can read (Priority: P1)

Content is collected outside the app, by Claude on demand or by the user by hand, and saved in the app's documented content format. When the app loads content, it checks it against the domain rules and clearly reports anything invalid instead of silently showing it.

**Why this priority**: Without a defined content format, there is nothing to display (US1) and Claude cannot produce content reliably. Validation enforces the constitution (credit, paraphrase, Patch rules) at the point content enters.

**Independent Test**: Prepare a set of content with valid entries and deliberately broken ones (missing Source, missing Patch on a Matchup Insight, unknown champion, quote too long). Load it and check that valid entries appear and each broken entry is reported with the rule it breaks.

**Acceptance Scenarios**:

1. **Given** content that follows the documented format, **When** the app loads it, **Then** all of it is available without any code change.
2. **Given** a Matchup Insight without a Patch, **When** content is loaded, **Then** the Insight is not displayed and a validation report names the entry and the broken rule (I2).
3. **Given** an Insight whose Source has no link, or a video Source without a timestamp, **When** content is loaded, **Then** it is reported as invalid (I1, I3).
4. **Given** content for a Matchup where neither champion is a Focus Champion of that Lane, **When** content is loaded, **Then** it is reported as invalid (I4).
5. **Given** an Insight with a General Concept as its subject and no Patch, **When** content is loaded, **Then** it is accepted (I2).
6. **Given** newly loaded content collected by Claude, **When** it is displayed, **Then** it carries the Unreviewed badge.

---

### User Story 3 - Record my Verdict and notes after a game (Priority: P1)

After playing a Matchup, the user opens it and sets their own Verdict (difficulty 1–5 and confidence) and writes Me notes about what happened. These are saved immediately and shown separately from external Sources and statistics.

**Why this priority**: The user is a first-class Source (D2.6), and rating Matchups after every game is the main in-app editing activity (D6.1).

**Independent Test**: Open any Matchup, set a Verdict and a note, restart the app, and confirm both persist, show the current Patch, and appear separately from external Insights and statistical difficulty.

**Acceptance Scenarios**:

1. **Given** a Matchup with no Verdict, **When** the user sets difficulty 4, confidence "medium" and a note, **Then** the Verdict is saved with the current Patch and today's date and survives an app restart.
2. **Given** a Verdict exists for the current Patch, **When** the user edits it, **Then** the new values replace it and the date is updated.
3. **Given** a Matchup with a Verdict and a Third-party Reference, **When** the page is shown, **Then** the user's difficulty and the statistical figures are displayed as separate signals and never combined (I10).
4. **Given** the user writes a Me note in a specific section, **When** the page is shown, **Then** the note appears in that section credited to "Me", visually distinct from external Insights.
5. **Given** a Verdict from an earlier Patch, **When** the user records a Verdict on the current Patch, **Then** a new Verdict is created and the earlier one stays visible in the Verdict history.

---

### User Story 4 - Navigate my champions and their Matchups (Priority: P2)

From a persistent sidebar, the user picks a Lane, then a Focus Champion, and sees all of that champion's Matchups as a sortable table (the default) or as a radial graph with the Focus Champion in the center and Opponents around it, colored by difficulty.

**Why this priority**: It turns separate pages into a usable knowledge base. Single Matchup pages (US1) are reachable without it via direct link, so it comes second.

**Independent Test**: With several Matchups for Akali, select Mid → Akali, sort the table by difficulty, switch to the graph, and open a Matchup from both views.

**Acceptance Scenarios**:

1. **Given** the app is open on any page, **When** the user looks at the sidebar, **Then** it shows Lanes (Mid, Bot) with their Focus Champions, plus entries for Archetypes, Opponents and General Concepts.
2. **Given** a Focus Champion page, **When** it opens, **Then** the table view is shown, listing each Matchup with Opponent, Opponent's Primary Archetype, the user's Verdict difficulty, statistical difficulty (or "not available"), number of Insights and number of Unreviewed Insights.
3. **Given** the table, **When** the user sorts by any column, **Then** rows reorder accordingly.
4. **Given** the radial graph view, **When** it is shown, **Then** each Opponent is a node colored by the selected difficulty signal (Verdict by default, switchable to statistical), and nodes without that signal are shown as neutral.
5. **Given** Akali vs Zed (Mid) content exists, **When** the user opens either Akali's or Zed's page, **Then** that Matchup appears on both, shown from the respective champion's perspective (I5, ADR 0002).
6. **Given** a Focus Champion page, **When** the user searches for any champion in the catalog without existing content, **Then** an empty Matchup page opens where all sections show gap markers and a Verdict can be recorded.

---

### User Story 5 - Review Claude-collected Insights (Priority: P2)

The user goes through Unreviewed Insights, approves the good ones, rejects the wrong ones, and flags pairs that contradict each other as Conflicts.

**Why this priority**: Keeps the knowledge base trustworthy (I13) while allowing immediate use of new content.

**Independent Test**: Load content with 5 Unreviewed Insights. Approve 3, reject 1, flag 1 pair as a Conflict, restart, and check the result.

**Acceptance Scenarios**:

1. **Given** Unreviewed Insights exist, **When** the user opens the review view, **Then** they are listed with their Matchup or General Concept, section, Source and Patch.
2. **Given** an Unreviewed Insight, **When** the user approves it, **Then** the badge is removed everywhere it appears, and this persists after restart.
3. **Given** an Unreviewed Insight, **When** the user rejects it, **Then** it is permanently deleted from the content and no longer appears anywhere (I13).
4. **Given** two Insights with the same subject and section, **When** the user flags them as a Conflict, **Then** they are displayed side by side as conflicting from then on (I12, I17).
5. **Given** two Insights with different subjects or sections, **When** the user tries to flag them as a Conflict, **Then** the app refuses and explains why (I17).

---

### User Story 6 - Learn General Concepts (Priority: P2)

The user opens a General Concept page (e.g. Wave Management or Lane Priority) to learn the fundamental itself, independent of champions, and sees where it is applied in their Matchups.

**Why this priority**: Explicit user request (D3.7). Concepts explain the "why" behind Matchup-specific advice.

**Independent Test**: Load 2–3 General Concepts with Insights. Open Wave Management, check its Insights have no Patch, and follow an "Applied in" link to a Matchup section and back.

**Acceptance Scenarios**:

1. **Given** the General Concepts list in the sidebar, **When** the user opens one, **Then** its credited Insights are shown, without Patch labels (I2), each with its noted date.
2. **Given** the Matchup section "Wave management & lane priority" in Orianna vs Syndra, **When** the page is shown, **Then** the section links to the Wave Management and Lane Priority concept pages.
3. **Given** a General Concept page, **When** Matchup sections refer to it, **Then** an "Applied in" list shows each of those Matchups and sections, with working links (D4.4).
4. **Given** a General Concept with no Insights yet, **When** it is opened, **Then** it shows a gap marker rather than an error.

---

### User Story 7 - See Opponent pages (Priority: P3)

The user opens an Opponent (e.g. Syndra) to see their Archetypes, general traits and every Matchup they have against the user's Focus Champions.

**Why this priority**: Useful for reuse (D3.4), but the same information is reachable via Matchups.

**Independent Test**: Open Syndra's page and check that it lists the Orianna vs Syndra Matchup, shows Primary Archetype "Control Mage", and shows champion-level Insights.

**Acceptance Scenarios**:

1. **Given** an Opponent, **When** their page opens, **Then** it shows name and icon, Primary and optional Secondary Archetype, champion-level Insights (e.g. general power curve) and links to all Matchups involving them.
2. **Given** a champion with no Archetype assigned yet, **When** their page opens, **Then** it shows "Archetype not classified" instead of guessing.

---

### User Story 8 - Compare Archetype Matchups (Priority: P3)

The user opens an Archetype Matchup (e.g. Assassin vs Control Mage, Mid) to read general principles for picking against that type of champion.

**Why this priority**: Requested (D1.9), but its computed half depends on feature 002.

**Independent Test**: Load authored Insights for Assassin vs Control Mage and open the page: the Insights appear, and computed figures show "not yet available".

**Acceptance Scenarios**:

1. **Given** authored Insights for an Archetype Matchup, **When** its page opens, **Then** they are shown credited, like Matchup Insights.
2. **Given** feature 002 is not in place, **When** an Archetype Matchup page opens, **Then** the computed figures area states "not yet available" and shows no numbers.
3. **Given** an Archetype Matchup page, **When** it opens, **Then** it lists the champions of each Archetype (by Primary Archetype) and links to the user's existing Matchups between them.

---

### User Story 9 - See third-party statistics with honest sample sizes (Priority: P3)

In a Matchup's Statistics section, the user sees hand-recorded Third-party References (e.g. LoLalytics win rate), each with its Source, rank filter, Patch, sample size and date recorded.

**Why this priority**: Gives numeric context before feature 002 exists (D4.6).

**Independent Test**: Record a LoLalytics reference with 136 games and another with 40, open the Matchup, and check that the first shows its numbers with sample size and the second shows "insufficient data".

**Acceptance Scenarios**:

1. **Given** a Third-party Reference with 136 games, **When** it is displayed, **Then** it shows the figures, "136 games", the rank filter, Patch or patch range, the Source with link, and the date recorded.
2. **Given** a Third-party Reference below 100 games, **When** it is displayed, **Then** the figures are replaced by "insufficient data (N games)" (I8).
3. **Given** both a Third-party Reference and (in future) own statistics, **When** displayed, **Then** they appear as separate figures and are never combined (I9).
4. **Given** a Third-party Reference for a rank below Emerald, **When** content is loaded, **Then** it is rejected by validation (I7).

---

### Edge Cases

- **New champion released**: a champion missing from the local catalog appears in content. Validation reports "unknown champion" until the catalog is refreshed from Data Dragon. No code change is needed after the refresh.
- **New Patch**: after a catalog refresh, all Matchup and champion Insights from earlier Patches show "possibly outdated". General Concept Insights are unaffected.
- **Two Focus Champions meet** (Akali vs Zed): one Matchup, stored once, listed on both pages, each showing its own perspective.
- **Bot Matchup with a non-marksman** (Ziggs vs Ezreal): valid; Ziggs keeps his own Archetype (I19).
- **Lane-conditional sections**: "Roaming & map pressure" only appears in Mid; "Support influence" only in Bot. Content placing an Insight in the wrong lane's section is reported as invalid (I6).
- **Conflict across Patches**: two conflicting Insights from different Patches are still shown side by side, each with its own Patch and outdated marker.
- **Rejecting an Insight that is part of a Conflict**: the Insight is deleted and the Conflict is removed with it; the remaining Insight is shown normally.
- **Champion with no Primary Archetype**: excluded from Archetype Matchup champion lists and shown as "not classified".
- **Duplicate Matchup** ({A, B} and {B, A} in the same Lane): treated as the same Matchup; content defining both is reported as a duplicate (I5).
- **Very long quote** in an Insight: reported as invalid (I3).
- **Content changed while the app is open**: Claude adds Insights while the user is typing a Verdict; the new Insights appear after automatic reload and the Verdict being typed is not lost.
- **Missing icon or offline**: the app never needs the network; a missing icon falls back to the champion's name.

## Requirements *(mandatory)*

### Functional Requirements

**Catalog**

- **FR-001**: The system MUST keep a local catalog of champions (name, icon), item and rune names, and known Patches, imported from Riot's Data Dragon by a separate refresh command run outside the app (by the user or Claude). The app itself MUST NOT access the network (ADR 0001).
- **FR-001a**: The app MUST show the catalog's current Patch and the date of the last catalog refresh.
- **FR-002**: The system MUST treat the most recent Patch in the catalog as the current Patch.
- **FR-003**: The system MUST store each champion's Primary Archetype and optional Secondary Archetype from the approved Archetype list (I16) and allow champions to remain unclassified.
- **FR-004**: The system MUST define Focus Champions as (champion, Lane) pairs, initially Akali, Zed and Orianna in Mid and Kai'Sa, Ezreal and Yunara in Bot. Adding or removing a Focus Champion MUST be a data change only.
- **FR-005**: The system MUST display Riot's "not endorsed by Riot Games" legal notice on every page.

**Content format and validation**

- **FR-006**: The system MUST read all external content (Insights, Sources, Conflicts, General Concepts, Archetype Matchup Insights, Third-party References) from a documented, human-readable, plain-text content format that can be written and edited outside the app.
- **FR-007**: The content format documentation MUST be detailed enough for Claude to produce valid content without reading the app's code, including one complete example per content type.
- **FR-008**: When loading content, the system MUST validate it against invariants I1–I8, I15–I17 and I19 (see the load rules in `contracts/content-format.md`) and MUST NOT display entries that break them. I9–I13 are display and review rules covered by other requirements; I11, I14 and I18 belong to feature 002.
- **FR-009**: The system MUST produce a validation report listing each rejected entry, its location in the content, and the broken rule in plain language.
- **FR-010**: Every Source MUST have a name and a kind (Official, Third-party statistic, Coaching, Me). Every external Insight MUST have a link, and video Sources MUST have a timestamp (I1, I3).
- **FR-011**: An Insight MUST store a paraphrase. A verbatim quote is optional and limited to one sentence of at most 200 characters (I3).
- **FR-012**: Matchup and champion Insights MUST have a Patch. General Concept Insights MUST NOT have one. Every Insight MUST have a noted date (I1, I2).
- **FR-013**: Every Matchup Insight MUST name its section and the side it is about: champion A, champion B, or both (I15).

**Matchups**

- **FR-014**: A Matchup MUST be identified by its two champions and Lane, regardless of order, and at least one champion MUST be a Focus Champion of that Lane (I4, I5).
- **FR-015**: Every Matchup page MUST show the fixed template in this order: Overview & difficulty; Win conditions (both sides); Power spikes; Early, mid and late game advantage; Trading patterns & stance; Tethering; Cooldown windows; All-in & kill windows; Defensive windows; Wave management & lane priority; Runes & summoner spells; Itemization; Roaming & map pressure (Mid only); Support influence (Bot only); Statistics (I6).
- **FR-016**: The Power spikes section MUST organize Insights by level (1–18) and by item, not as one undivided list.
- **FR-017**: A Matchup page MUST be shown from the perspective of the Focus Champion it was opened from. When both champions are Focus Champions, the user MUST be able to switch perspective.
- **FR-018**: Each section with no Insights MUST show a gap marker.
- **FR-019**: Each Matchup section MUST link to the General Concepts it applies, per a fixed section-to-concept mapping that is part of the content.
- **FR-020**: Insights whose Patch is older than the current Patch MUST be marked "possibly outdated" with their Patch shown. The current-Patch Insights MUST be shown first within each section.
- **FR-021**: Conflicting Insights MUST be displayed side by side, labeled as a Conflict, with neither visually ranked above the other (I12).

**User's own data (editable in-app)**

- **FR-022**: Users MUST be able to create and edit one Verdict per Matchup per Patch: difficulty 1–5, confidence (low, medium, high), free notes; the current Patch and the date are recorded automatically (D5.5). Editing on the same Patch replaces that Patch's Verdict; recording on a newer Patch creates a new one and keeps older ones as history.
- **FR-022a**: A Matchup page MUST show the latest Verdict prominently and list earlier Verdicts (Patch, difficulty, confidence, date). The latest Verdict is the one used for difficulty in tables and the radial graph.
- **FR-023**: Users MUST be able to add, edit and delete Me notes in any Matchup section and on any General Concept. Me notes MUST be credited to "Me" and displayed distinctly from external Insights.
- **FR-024**: Users MUST be able to approve or reject Unreviewed Insights. Approval removes the Unreviewed badge; rejection permanently deletes the Insight and any Conflict it belongs to (I13).
- **FR-025**: Users MUST be able to flag two Insights as a Conflict only if they share subject and section; otherwise the system MUST refuse with an explanation (I17).
- **FR-026**: All in-app edits MUST persist across app restarts and MUST be stored in the same plain-text content format (FR-006), so that Claude and version control can read them.
- **FR-026b**: The system MUST store the user's own data (Verdicts, Me notes, review decisions, Conflict flags) separately from Claude-collected content, so that writing one never overwrites the other. The only app write into collected content is deleting a rejected Insight (FR-024), which MUST touch only that Insight's entry.
- **FR-026c**: When content changes on disk while the app is open, the system MUST reload it and re-validate it automatically, without losing unsaved in-app input.
- **FR-026a**: All content (external Insights, Sources, Conflicts, General Concepts, Third-party References, Verdicts, Me notes, review state) MUST live in a separate content repository whose location is configured by path. The public code repository MUST contain no collected content, only the format documentation and a small demo dataset written by the user.
- **FR-027**: The app MUST NOT offer any way to create or edit external (non-Me) Insights' text in-app (ADR 0001).

**Navigation and pages**

- **FR-028**: A persistent sidebar MUST provide Lane → Focus Champion → Matchups, plus Archetypes, Opponents and General Concepts.
- **FR-029**: A Focus Champion page MUST show its Matchups as a sortable table (default view) and as a radial graph, switchable by the user, as described in US4.
- **FR-030**: The radial graph MUST color Opponents by one difficulty signal at a time (Verdict by default, switchable to statistical); it MUST NOT combine the two (I10).
- **FR-031**: Users MUST be able to open a Matchup against any catalog champion from a Focus Champion page, even with no existing content.
- **FR-032**: Opponent pages MUST show Archetypes, champion-level Insights and links to all Matchups involving that champion.
- **FR-033**: General Concept pages MUST show their Insights, Me notes and an "Applied in" list of linked Matchup sections.
- **FR-034**: Archetype Matchup pages MUST show authored Insights, the champions per Primary Archetype, links to existing Matchups between them, and a "not yet available" placeholder for computed figures.
- **FR-035**: A review view MUST list all Unreviewed Insights with Matchup or General Concept, section, Source and Patch.

**Statistics (third-party only in this feature)**

- **FR-036**: The Statistics section MUST show Third-party References with Source and link, rank filter, Patch or labeled patch range, sample size and date recorded.
- **FR-037**: Any figure with fewer than 100 games MUST be shown as "insufficient data (N games)" instead of its value (I8).
- **FR-038**: Third-party References for ranks below Emerald MUST be rejected by validation (I7).
- **FR-039**: Where own statistics are not yet available, the Statistics section MUST say so explicitly.

**Scope guards**

- **FR-040**: The app MUST run locally without any network access, without accounts, and without any in-app AI chat.
- **FR-041**: The app MUST support only the Mid and Bot Lanes; content for any other lane MUST be rejected by validation.

### Key Entities *(include if feature involves data)*

- **Champion**: a playable champion from the catalog: name, icon, Primary Archetype, optional Secondary Archetype.
- **Focus Champion**: a (Champion, Lane) pair the user studies.
- **Archetype**: an entry of the approved community Archetype list.
- **Lane**: Mid or Bot.
- **Patch**: a game version from the catalog (e.g. 16.22); the most recent is the current Patch.
- **Matchup**: an unordered champion pair in one Lane with at least one Focus Champion; owns sections, Insights, an optional Verdict and Third-party References.
- **Section**: one of the fixed template slots of a Matchup; some are lane-conditional; linked to General Concepts.
- **Insight**: a credited paraphrased claim about a Matchup (section + side), champion, Archetype Matchup or General Concept, with Source, link, optional locator, optional short quote, Patch (except General Concepts), noted date and review status.
- **Source**: a credited origin with a name, kind and home link; "Me" is a Source.
- **Conflict**: an explicit link between two Insights with the same subject and section.
- **Verdict**: the user's difficulty (1–5), confidence, notes, Patch and date for one Matchup; at most one per Matchup per Patch, older ones kept as history.
- **Me note**: free text by the user attached to a Matchup section or a General Concept.
- **General Concept**: a patch-independent League fundamental with Insights and "Applied in" links.
- **Archetype Matchup**: an Archetype pair in one Lane with authored Insights.
- **Third-party Reference**: a hand-recorded figure (e.g. win rate) with Source, rank filter, Patch or patch range, sample size and date recorded.
- **Validation report**: the list of rejected content entries with location and broken rule.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Orianna vs Syndra Matchup is fully filled: all 14 Mid sections contain at least one credited Insight or Me note, and at least one Conflict is shown side by side.
- **SC-002**: At least 3 General Concept pages (including Wave Management and Lane Priority) have credited Insights and working "Applied in" links from Orianna vs Syndra.
- **SC-003**: From app launch, the user reaches any existing Matchup in at most 3 clicks.
- **SC-004**: Recording or updating a Verdict after a game takes under 30 seconds.
- **SC-005**: 100% of displayed external Insights show Source, link and noted date, and 100% of Matchup Insights show a Patch.
- **SC-006**: A test content set containing one violation of each validated invariant is loaded, and 100% of the violations are reported and none of the invalid entries is displayed.
- **SC-007**: Adding a new Focus Champion, Opponent, Source, General Concept or Patch requires zero code changes.
- **SC-008**: Claude, given only the content format documentation, produces a new Matchup's content that loads with zero validation errors on the first or second attempt.
- **SC-009**: Every page opens in under 1 second on the user's machine with the full validation-slice content loaded.
- **SC-010**: The app works fully with the network disconnected; only the separate catalog refresh command needs a connection.

## Assumptions

- The only user is the project owner, on their own computer. No authentication or multi-user support is needed (D1.5).
- Content is collected outside the app by Claude or by hand (ADR 0001). The collection workflow itself is not part of this feature, only the format it must produce.
- In-app edits and external content share one plain-text format, so the user's data is also readable by Claude and version control (FR-026). All of it lives in a separate private content repository (FR-026a); the app does not commit or push it, the user does.
- The section-to-General-Concept mapping is defined once as content, e.g. "Wave management & lane priority" → Wave Management, Lane Priority.
- A Matchup appears on a Focus Champion page once it has any content (Insight, Me note, Verdict or Third-party Reference). Other Opponents are reachable through search (FR-031).
- Statistical difficulty is shown as "not available" until feature 002 provides own statistics. Third-party References do not produce a difficulty rating.
- The quote length limit (200 characters, one sentence) is a working default and may be tuned.
- The visual style follows the "Antique Gold & Deep Violet" art direction (`docs/design/palette-antique-gold-deep-violet.png`, D12.1): deep violet surfaces, antique gold structure, ivory text, slow ambient animation, with data kept high-contrast and still. `docs/design/reference-direction.webp` remains a layout reference only.
- Initial Opponents for the validation slice are chosen by the user or suggested by Claude (D1.8); only Orianna vs Syndra must be complete for SC-001.

## Dependencies

- Riot Data Dragon availability for catalog refreshes (permitted; see `docs/research/data-sources.md`).
- Feature 002 (Statistics collector) for own statistics, statistical difficulty and computed Archetype Matchup figures. This feature shows explicit placeholders until then.
