<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1 (PATCH: product renamed LoLMechs → FLC, D16.1; no principle changes)
-->

# FLC Constitution

## Core Principles

### I. Credit & Paraphrase

- Every Insight MUST credit exactly one Source and MUST carry a link to it; video Sources MUST
  also carry a timestamp.
- Insights MUST be stored as paraphrases in our own words. A verbatim quote, if any, MUST be at
  most one short sentence. Transcripts, full guides or copied articles MUST NOT be stored.
- Paywalled content MUST NOT be used as a Source.

Rationale: crediting is not permission; paraphrased, linked notes keep the project on the
low-risk side of copyright (docs/research/data-sources.md, D2.1).

### II. Permitted Data Access Only

- Automated data access is permitted ONLY to the official Riot API and Data Dragon, within Riot's
  policies, including showing Riot's "not endorsed" disclaimer and using a Riot-issued key.
- Third-party websites MUST NOT be scraped or accessed by automated means.
- Third-party numbers (e.g. LoLalytics) MAY be hand-recorded only as a Third-party Reference:
  credited, dated, and NEVER combined with our own statistics into one figure.

Rationale: research found that the Riot API is the only source that both permits automation and
has the needed data; several third-party sites explicitly forbid scraping (D4.6).

### III. Honest Statistics

- Statistics MUST cover Emerald+ games only.
- Every statistic MUST show its sample size. Below the minimum sample (initially 100 games) the
  app MUST show "insufficient data" instead of a number.
- Statistics combined across patches MUST be labeled with the patch range (e.g. "16.20–16.22").
- Player identifiers (PUUIDs) MUST NOT be stored; only totals and match IDs.

Rationale: matchup samples are small (D3.10); a confident-looking number from 12 games teaches
the wrong lesson.

### IV. Never Blend Perspectives

- Conflicting Insights MUST both be kept and shown side by side; the app MUST NOT pick a winner.
- Statistical difficulty and the user's Verdict MUST be shown separately, never as one score.
- Unreviewed Insights MUST be visibly marked until the user approves them; rejected ones are
  deleted.

Rationale: disagreement between Sources, data and personal experience is itself study material
(D2.4, D3.5, D5.4).

### V. Local, $0, Personal

- The app MUST run locally with no hosting, no user accounts and no paid services.
- The app MUST NOT include an in-app LLM or chat.
- Collecting external content happens outside the app (Claude on demand or manual entry). Inside
  the app, only the user's own data is editable: Verdicts, Me notes, review decisions, Conflict
  flags (ADR 0001).
- Collected third-party content and statistics MUST be kept out of the public repository.

Rationale: personal study tool, zero budget, code public as a portfolio piece (D1.5, D1.13, D2.1).

### VI. Simplicity & Ubiquitous Language

- Code, specs, tickets and UI MUST use the terms defined in CONTEXT.md.
- Adding a champion, Archetype, Source or Patch MUST be a data change, never an architectural one.
- No abstraction without a current, concrete need: a seam is introduced only when two real
  adapters vary across it.

Rationale: the roster grows to every mid laner and ADC; speculative structure slows a solo
project down.

### VII. Test Through Interfaces

- Behaviour MUST be tested at module interfaces, not internal details.
- Every invariant in docs/domain/model.md MUST be covered by at least one automated test.

Rationale: invariants are the domain's contract; testing them at the interface keeps refactors
safe.

## Scope Constraints

- Lanes: Mid and Bot only. Bot means the two Bot-position players; supports are out of scope
  except as short "support influence" notes.
- Language: UI and stored Insights in English, linking to original-language Sources.
- Out of scope: top, jungle and support matchups; public hosting; monetization; AI chat; ranks
  below Emerald.

## Development Workflow

- Spec-Driven Development: discovery decisions (docs/discovery/decisions.md) → CONTEXT.md and
  ADRs (docs/adr/) → spec-kit spec and plan → vertical-slice tickets (Matt Pocock `to-tickets`).
- Decisions that are hard to reverse, surprising, and the result of a real trade-off MUST be
  recorded as an ADR.
- Significant product or architectural decisions require the user's explicit approval.

## Governance

- This constitution supersedes other practices. Specs, plans and tickets MUST comply; any
  deviation MUST be justified in the plan's complexity tracking and approved by the user.
- Amendments require the user's approval and an entry in docs/discovery/decisions.md.
- Versioning follows semver: MAJOR for removed or redefined principles, MINOR for added or
  materially expanded principles/sections, PATCH for clarifications.
- Riot's policies MUST be re-checked before each major build phase (policy drift risk).

**Version**: 1.0.1 | **Ratified**: 2026-11-04 | **Last Amended**: 2026-11-11
