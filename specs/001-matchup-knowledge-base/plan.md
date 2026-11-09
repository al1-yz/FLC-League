# Implementation Plan: Matchup Knowledge Base

**Branch**: `001-matchup-knowledge-base` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-matchup-knowledge-base/spec.md`

## Summary

This is a local, single-user Next.js app that reads a private **content repository** of YAML files.
The files hold Matchups, Insights, Sources, General Concepts, Archetype Matchups and Third-party
References. The app validates them against the domain rules and presents them as a navigable study
tool. The only data the app writes is the user's own (Verdicts, Me notes, review decisions,
Conflicts), stored under `me/`. A separate CLI refreshes the Data Dragon catalog. Three deep modules
(Content, UserData, Catalog refresh) carry all the behaviour; the UI is a thin layer over them.

## Technical Context

**Language/Version**: TypeScript (version supported by Next 16), Node 24

**Primary Dependencies**: Next.js 16 (App Router), React 19, Zod 4, yaml 2.9, chokidar 6, D3 7, Tailwind CSS 4

**Storage**: YAML files in a separate private git repository (`LOLMECHS_CONTENT_DIR`); no database

**Testing**: Vitest 5 (modules, rule coverage), Playwright 1.65 (3 E2E flows)

**Target Platform**: Desktop browser on localhost (Linux); no hosting

**Project Type**: Local web application (single Next.js project) + CLI script

**Performance Goals**: every page < 1 s with validation-slice content (SC-009); content change visible within ≤ 2 s (FR-026c)

**Constraints**: no network at runtime (FR-040); single user; $0; collected content never in the public repo

**Scale/Scope**: 6 Focus Champions × up to ~60 Opponents; low thousands of Insights; ~12 General Concepts; ~10 page types

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | How the design complies | Status |
|---|---|---|
| I. Credit & Paraphrase | R-SRC, R-QUOTE enforced on load; Insights without credit are never displayed | ✅ |
| II. Permitted Data Access Only | Only the catalog CLI uses the network, and only Data Dragon; no scraping code; References are hand-written YAML, separate from own stats | ✅ |
| III. Honest Statistics | R-RANK on load; display rule for < 100 games; patch ranges labeled; no player data at all in 001 | ✅ |
| IV. Never Blend Perspectives | Conflicts are rendered side by side; Verdict and statistical signals are separate fields and never combined in the graph or tables; Unreviewed is derived and badged | ✅ |
| V. Local, $0, Personal | localhost only, no accounts, no LLM; content in a private repo; the app writes only to `me/` (ADR 0001) | ✅ |
| VI. Simplicity & Ubiquitous Language | 3 modules, no database, no speculative seams; champions, Sources, concepts and Patches are data | ✅ |
| VII. Test Through Interfaces | Vitest tests the Content and UserData interfaces with fixture folders; a rule-coverage table enforces one test per validated rule | ✅ |

**Post-design re-check (after Phase 1)**: still passing. No violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-matchup-knowledge-base/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── content-format.md
│   └── modules.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/
├── app/                         # Next.js routes (thin UI layer)
│   ├── layout.tsx               # sidebar, Riot notice, live-reload listener
│   ├── [lane]/[champion]/page.tsx              # Focus Champion: table | graph
│   ├── [lane]/matchup/[pair]/page.tsx          # Matchup (?as=<champion> perspective)
│   ├── opponents/[champion]/page.tsx
│   ├── concepts/[concept]/page.tsx
│   ├── archetypes/[lane]/[pair]/page.tsx
│   ├── review/page.tsx
│   ├── validation/page.tsx      # validation report
│   └── api/content-events/route.ts            # SSE
├── content/                     # Content module (deep): load + validate → KnowledgeBase
├── user-data/                   # UserData module (deep): writes under me/
├── ui/                          # shared components: Insight card, Conflict pair, RadialGraph, badges
└── theme/                       # Tailwind tokens (dark/glass/teal, difficulty scale)
scripts/
├── catalog-refresh.ts           # Data Dragon → content repo catalog/
└── schema-generate.ts           # Zod → JSON Schema docs for Claude
demo-content/                    # small demo dataset, written by the user (public)
tests/
├── content/                     # Vitest + fixture content folders
├── user-data/
└── e2e/                         # Playwright
```

**Structure Decision**: a single Next.js project. Domain behaviour lives in `src/content` and
`src/user-data`, which never import from `src/app`. Routes only call module interfaces, so the
modules can be tested without the UI.

## Complexity Tracking

No constitution violations.
