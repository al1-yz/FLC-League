# Discovery Decision Log

Each grilling round's outcomes. **D** = decided, **O** = open, **H** = hypothesis awaiting research.

## Round 1 — 2026-11-04

### Tooling & workflow
- **D1.1** Pipeline: Matt Pocock `grilling` + `domain-modeling` (discovery) → `research` (feasibility) → spec-kit `constitution` → `specify` → `clarify` → `analyze` → `plan` → Matt Pocock `to-tickets` (vertical slices) instead of `speckit-tasks`. `to-spec`, `wayfinder`, `grill-with-docs` not used.
- **D1.2** Glossary file is `CONTEXT.md` (installed skill version 1.2.3 convention).
- **D1.3** spec-kit v1.3.0 installed (pinned to the GitHub tag), initialized with the Claude integration. Commands are invoked as `/speckit-<name>`.
- **D1.4** Git repo initialized locally. GitHub remote to be created later by the user; until then tickets live as local markdown.

### Product scope
- **D1.5** Audience: the user only. Personal learning tool. **Never published or hosted publicly.** No accounts, no monetization.
- **D1.6** Lanes in scope: **Mid** and **Bot (ADC)** only. Top, jungle, support are out of scope.
- **D1.7** Classification uses the **community archetype taxonomy** (e.g. Control Mage, Battlemage, Assassin, Artillery Mage), not Riot's official classes.
- **D1.8** Focus champions: Akali, Zed, Orianna (the user's mains). Their matchups are against **other** mid laners, not each other. Start with ~5 opponents each (examples: Orianna vs Syndra, Akali vs Sylas); the goal is eventually every mid laner.
- **D1.9** Matchup = champion A vs champion B (in a lane). **Archetype vs archetype** analysis is also wanted, to guide picks against an archetype.
- **D1.10** Content refreshes are **on demand** (when the user asks, e.g. a new patch), with no scheduler.
- **D1.11** Qualitative content comes from external creators (coaches, analysts, guides) and is **always credited** to its source. Purpose: teaching/personal study only. Statistical data is also aggregated from multiple sources.
- **D1.12** Qualitative-first MVP is acceptable. Building our own stats pipeline is acceptable too (decision deferred to Phase 2 research).
- **D1.13** Budget: **$0**. No stack preference; the stack is decided in Phase 5.
- **D1.14** Visual direction: `docs/design/reference-direction.webp`, a dark, glassy, teal-accented UI with a radial relationship graph, a detail side panel with KPI cards, and an "ask a question" AI box. Direction only, not a spec.

### Open after round 1
- ~~O1.1~~ → D2.1 · ~~O1.2~~ → D2.2 · ~~O1.3~~ → D2.3
- ~~H1.1~~ Research done → `docs/research/data-sources.md` (2026-11-04). Summary: the Riot API is the only source that both permits automated access and holds the needed data. DPM.lol, OP.GG (website), Mobalytics, YouTube and Reddit ban scraping. Sample size is the binding constraint.

## Round 2 — 2026-11-04

- **D2.1** Code is public on GitHub as a portfolio piece; the app runs **locally only**. Collected third-party content and stats are kept out of the public repo by default. If any is ever shown publicly, every item is credited. Caveat recorded: credit is not the same as permission, so content is stored as **paraphrased insights with a short quote at most, plus a link**, never full copies or transcripts.
- **D2.2** Bot lane = **ADC vs ADC only** (supports ignored). Bot Focus Champions: **Kai'Sa, Ezreal, Yunara**. Mid Focus Champions stay Akali, Zed, Orianna.
- **D2.3** Archetype Matchups are both **authored** (credited principles) and **computed** (aggregated from champion Matchups). Each champion has one **primary** archetype and an optional **secondary**; computed figures use the primary only.
- **D2.4** Conflicting Sources are **shown side by side, each credited**, with contradictions visibly flagged. No merged "official truth".
- **D2.5** Content collection is **mostly Claude-run on demand** (reads user-approved sources, writes structured, credited insights for the user to review) plus manual entry. "Update" is an agent workflow outside the app; **the app is read-only** over the data.
- **D2.6** The user ("Me") is a first-class Source: personal notes, verdicts and confidence, displayed separately from external Sources.
- **D2.7** Each Matchup uses a **fixed section template**. Power spikes are structured by level (1–18) and by item.
- ~~O2.1~~ → D3.1

## Round 3 — 2026-11-04

- **D3.1** No in-app AI chat. The reference image is visual direction only.
- **D3.2** Statistics cover **Emerald+ only**; nothing below Emerald is collected or shown. Filters available within that: rank tier (Emerald / Diamond / Master+), patch, and server (see D3.9).
- **D3.3** Patch history is kept as snapshots. The latest refreshed patch is the default view, older Insights are marked "possibly outdated", and stats can be compared against the previous snapshot.
- **D3.4** Opponents get light pages: Primary/Secondary Archetype, general traits, and links to all Matchups against Focus Champions. Opponent info is written once and reused across Matchups.
- **D3.5** Difficulty is two separate signals, never blended: statistical (win rate) and the user's verdict (Me).
- **D3.6** The fixed Matchup template has 15 sections: overview & difficulty, win conditions (both sides), power spikes (level + item), early/mid/late advantage, trading patterns & stance, tethering, cooldown windows, all-in & kill windows, defensive windows, wave management & lane priority, runes & summoner spells, itemization, roaming & map pressure (mid only), support influence (bot only), statistics.
- **D3.7** **General Concepts** (wave management, lane priority, roaming, map pressure, objectives, …) get their **own section of the app**, independent of any Matchup. Matchup sections apply those concepts to a specific lane.
- **D3.8** Navigation: a sidebar with Lane → Focus Champion → Matchups, plus Archetypes, Opponents and **General Concepts**. The Focus Champion page has a radial graph and a sortable table, with the table as the default.
- **D3.9** English UI and English Insights, linking to original-language Sources.
- **D3.10** Sample-size policy: every stat shows its sample size. Below the minimum (initially 100 games) the app shows "insufficient data". When one patch is too thin, the last 2–3 patches are combined and labeled as a range (e.g. "16.20–16.22").
- **D3.11** Servers: BR + EUW + KR, with a server filter. The default view combines all three.
- **D3.12** The stats pipeline stores **totals + match IDs only**, never player IDs (PUUIDs).
- ~~O3.1~~ → D4.1

## Round 4 — 2026-11-04

- **D4.1** After the spec is written, the user submits the Riot **personal key** application. Claude drafts the form text. Development proceeds on the 24h development key meanwhile.
- **D4.2** Starting General Concepts: wave management (freeze, slow push, fast push, crash, bounce), lane priority (when, why, using it to ward/roam/gank/contest), roaming, map pressure, objectives, trading (stance, tethering), power spikes, cooldown tracking, all-in vs poke, recall timing, vision & warding, tempo. The list is extensible; content is filled on demand.
- **D4.3** Insights about General Concepts **never carry a Patch**. Insights about Matchups and champions always do. Every Insight records the date it was noted, so patch-sensitive concept facts (e.g. objective timers) can still be judged for age.
- **D4.4** Matchup sections and General Concepts link both ways ("Applied in" on concept pages).
- **D4.5** Creators: Claude proposes a starting list and the user approves it (see `docs/discovery/sources-shortlist.md`). Paywalled content is excluded.
- **D4.6** Hand-recorded LoLalytics numbers are allowed as a separately credited, dated "third-party reference", never mixed into our own calculations. No automated scraping.
- **D4.8** Source shortlist approved, with Midbeast replaced by Coach Mysterias and BIZYZE added for ADC (`docs/discovery/sources-shortlist.md`).
- **D4.9** **Shared understanding confirmed** by the user (2026-11-04). Phase 1 complete → Phase 3 (domain modeling).
- **D4.7** Build order: **content first**. The first slice is the Orianna vs Syndra Matchup page with credited Insights, 2–3 General Concept pages, Data Dragon static data and hand-recorded stats. The Riot stats pipeline comes second.

## Round 5 (domain modeling) — 2026-11-04

- **D5.1** A Matchup is an unordered pair {A, B} + Lane with at least one Focus Champion. Two Focus Champions can meet (Akali vs Zed); allowed but low priority. → ADR 0002
- **D5.2** Every Matchup Insight is tagged with the side it is about: A, B or both. Pages show the perspective of the Focus Champion the user came from.
- **D5.3** The Bot Opponent is whoever plays the Bot position, any class (e.g. Ziggs bot), keeping their own Archetype.
- **D5.4** Insights collected by Claude are visible with an **Unreviewed** badge until approved; rejected Insights are deleted.
- **D5.5** Verdict = difficulty 1–5, confidence (low/medium/high), free notes, Patch.
- **D5.6** Computed Archetype Matchups use **all** collected games in the Lane, not only Focus Champion games.
- **D5.7** Conflicts are marked explicitly (by Claude while collecting or by the user in review); no automatic detection.
- **D5.8** Archetype list approved with corrections: Sylas = Battlemage, LeBlanc = Assassin, Yunara = Hypercarry. → `docs/domain/archetypes.md`, ADR 0003
- **D5.9** ADR 0001 recorded: the app is read-only; collecting happens outside it.

## Round 6 — 2026-11-04

- **D6.1** The app allows in-app editing of the **user's own data only**: Verdicts, Me notes, approving/rejecting Unreviewed Insights, flagging Conflicts. External content collection stays outside the app. ADR 0001 amended.
- **D6.2** Phase 3 (domain modeling) complete → Phase 4 (spec-kit).

## Spec clarify, feature 001 — 2026-11-09

- **D7.1** All content lives in a separate **private content repository**, configured by path. The public code repo has only the format docs and a user-written demo dataset (FR-026a).
- **D7.2** One Verdict per Matchup per Patch; same-Patch edits replace it, and older Patches are kept as history (FR-022, FR-022a).
- **D7.3** The user's own data is stored in separate files from Claude-collected content, and the app auto-reloads on change (FR-026b, FR-026c).
- **D7.4** The Data Dragon catalog is refreshed by a separate command outside the app; the app never touches the network (FR-001, FR-001a).

## Stack — 2026-11-09

- **D8.1** Stack approved → ADR 0004: Next.js (TS, local), YAML content + Zod (+ generated JSON Schema), no database in 001, Tailwind, D3, Vitest + Playwright, catalog refresh as a CLI script.

## Analyze remediation, feature 001 — 2026-11-09

- **D9.1** `/speckit-analyze` found 1 critical, 1 high, 3 medium and 4 low issues; all 9 fixed. The key one: `demo-content/` (public) holds only user-written examples; real collected content goes only in the private content repo (constitution V). Content-collection tasks added for SC-001/SC-002 (T022a, T049a) and a Claude-authoring check for SC-008 (T030a).

## Tickets, feature 001 — 2026-11-09

- **D10.1** 17 vertical-slice tickets approved and written to `.scratch/001-matchup-knowledge-base/issues/` (local markdown tracker). 15 are `ready-for-agent`; 15 and 16 (content collection) are `ready-for-human`. Planning for feature 001 is complete. Feature 002 (statistics collector) is a separate spec cycle.

## Repositories — 2026-11-09

- **D11.1** Public code repo: `al1-yz/FLC-League` (remote `origin`). Private content repo: `al1-yz/FLC-League-private`, cloned at `/home/kcab/FLC-League-private`.

## Art direction — 2026-11-09

- **D12.1** Art direction changed to **"Antique Gold & Deep Violet"** (#B9A38B / #2C1F33; `docs/design/palette-antique-gold-deep-violet.png`). It supersedes the teal accent from D1.14; the original reference image is kept for layout only. Luxurious and elegant: Fraunces display serif + Jost text (self-hosted), animated ambient patterns (drifting glow, art-deco fan pattern, gold title glint, drawn ornaments, staggered reveals), with data shown high-contrast and static. Motion respects `prefers-reduced-motion`.

## Matchup redesign — 2026-11-09

- **D13.1** No compound Sections: every "&" Section is split (e.g. Wave management / Lane priority, Runes / Summoner spells, All-in windows / Kill windows, Early / Mid / Late game, Overview / Difficulty, Trading patterns / Trading stance, Roaming / Map pressure). Sections are grouped: Overview, Game timeline, Trading, Windows, Build, **General Concepts** (Tethering, Wave management, Lane priority, Roaming, Map pressure: shown inside the Matchup and also as standalone General Concept pages), Statistics. Mid has 22 Sections, Bot 21. Supersedes the 15-section list of D3.6.
- **D13.2** Dashboard-style Matchup page (user reference image): the Focus Champion's **skin splash art** as full-page background (skin chosen per champion in `config/skins.yaml`, e.g. Dark Star Orianna; downloaded from Data Dragon by the catalog refresh into the private Content Repository), two champion panels joined by animated flow lines to a central orb, and a particle-wave Game timeline above the grouped details. The gold/violet palette (D12.1) is kept.
- **D13.3** Ticket 02 (catalog refresh) was done early, because the splash backgrounds depend on it. `.env.local` points the app at the private content repo.

## Riot API — 2026-11-09

- **D14.1** Riot approved the **personal API key** (D4.1 done). The key lives only in `.env.local` as `RIOT_API_KEY` (git-ignored) and is never pasted into chat, committed, or written to the content repo. It is used by feature 002 (statistics collector); feature 001 never touches the network.

## Step-by-step redesign — 2026-11-11

- **D15.1** General Concepts are **removed from the Matchup page** and live only on their own General Concept pages (ticket 10). The Matchup template is now 17 Sections (Mid) / 18 (Bot) in 6 groups. Supersedes the General Concepts group of D13.1. FR-019 (Section → concept links) stays: Matchup Sections may still link out to concepts.
- **D15.2** Palette changed to **"Velvet Fjord"** (#23211B, #504C48, #988382, #B8B3CA, #E5B8A8; `docs/design/palette-velvet-fjord.webp`); blush is the glowing accent, lavender is for opponent/secondary data. Supersedes D12.1. Type: **Aeonik** is used when installed locally (it's a commercial font and can't be bundled or committed); otherwise **Geist** (OFL), which is close in style.
- **D15.3** The Matchup Sections are presented as a **connected step-by-step game plan** (`docs/design/reference-step-flow.png`): Read the lane → Know the spikes → Early game → Trade → Pick your windows → Mid game → Late game → Build for it, with a step rail on the particle wave. This replaces the category cards. Presentation only; the content model is unchanged.
- **D15.4** A **statistics analysis prototype** (`/prototype/stats`, clearly marked sample data) explores a gamified view: ring KPIs, tier badge, an influence map of opponents, an archetype "handshake" diagram, win rate by game length with Early/Mid/Late bands, level-spike bars, and a build quest line. Real data comes with feature 002; awaiting the user's review.

## FLC experience redesign — 2026-11-11

- **D16.1** Product renamed **FLC**: "Focus. Learn. Climb." / "Full Lane Control" (was LoLMechs). The UI, CLAUDE.md, CONTEXT.md and constitution title are updated (constitution v1.0.1, PATCH). The local folder and repo names are unchanged.
- **D16.2** **No sidebar.** Navigation is a floating, rounded **top bar** with lane menus listing the Focus Champions. A **landing page** shows an original, procedurally drawn misty fjord with falling snow (inspired by the Freljord mood, not Riot artwork), a large thin "FLC" title, and numbered lanes ("01 Mid lane", "02 Bot lane").
- **D16.3** **Focus Champion page** (ticket 07, started): a glass capsule over the splash art, laid out like a weather card. The lane glyph and name sit where the weather goes, the champion's name is the "place", and the "readings" are **Archetype** and **species**. Species is a new optional ChampionProfile field filled from a Source (it isn't in Riot game data); it shows "—" until set. The Matchup list follows below.
- **D16.4** The **Matchup page is an architectural analysis sheet**: a title block of specs, an exploded "phase stack" (power spikes, early, mid, late) with leader-line labels, circular detail callouts (Trading, Windows, Build), a lane section measured by level 1–18, and coach notes as numbered annotations. Replaces the step cards of D15.3.

## Ethereal review — 2026-11-11

- **D17.1** Top bar shows only "FLC" (no subtitle), with navigation centred. The landing drops the numbered lane lists; under FLC sits "Focus · Learn · Climb", and a lower text block reads "Full Lane Control" with a short description, no numbers.
- **D17.2** **Ethereal split scene** (`docs/design/reference-ethereal-split.png`): images are sharp on the right and dissolve into blur and mist on the left. Used for the landing photo and for champion splash backgrounds. The procedural fjord is removed. The landing photo goes in `public/landing/fjord.jpg` and must be public-domain/CC0 or the user's own (source recorded in `public/landing/README.md`); a soft gradient is shown until then.
- **D17.3** **Flow over analysis feel.** The dark sheet box is removed. Game-phase plates float, and a glowing current with travelling lights weaves through them on curved leader lines. Detail callouts breathe and have slowly turning orbits, and the lane line undulates. Coach notes become a **river**: they alternate along a winding dotted line and drift in out of the mist as you scroll.

## Backgrounds — 2026-11-11

- **D18.1** Champion splash art is **no longer used as a page background** (Data Dragon splashes look low-resolution at full screen). Champion and Matchup pages use a **Velvet Fjord palette scene**: slowly drifting lavender, blush, mauve and stone light over midnight, with the same blur-left treatment. Splash art remains only in the champion capsule's small circle.
- **D18.2** Landing photo: "Kenai Fjords National Park (18d2be72…)" by Victoria Stauffenberg (US National Park Service, **public domain**), stored at `public/landing/fjord.jpg`, source recorded in `public/landing/README.md`.
