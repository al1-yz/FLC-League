# Quickstart & Validation: Matchup Knowledge Base (001)

How to run the feature and prove it works end to end. Formats are in
[contracts/content-format.md](contracts/content-format.md), interfaces in [contracts/modules.md](contracts/modules.md).

## Prerequisites

- Node 24+, npm.
- A **private** GitHub repository cloned locally as the content repository (D7.1). Or skip it and use `./demo-content`.

## Setup

```bash
npm install
echo "LOLMECHS_CONTENT_DIR=/path/to/lolmechs-content" > .env.local
npm run catalog:refresh        # needs network; writes catalog/ into the content repo
npm run dev                    # http://localhost:3000
```

## Validation scenarios

| # | Scenario | Expected | Covers |
|---|---|---|---|
| V1 | `npm test` | All Vitest suites pass, including the rule-coverage table with one fixture per validation rule | SC-006, constitution VII |
| V2 | Open Mid → Orianna → Syndra | 22 Sections in their groups and template order; every Insight credited with link, Patch and date; ≥1 Conflict side by side; gap markers where empty | US1, SC-001, SC-005 |
| V3 | Add an Insight to the Matchup file in an editor while the page is open | It appears within 2 seconds, with the Unreviewed badge, without a manual reload | US2, FR-026c |
| V4 | Add a broken Insight (no `patch`) | It is not shown; the validation report names the file, entry and rule R-PATCH | US2, FR-009 |
| V5 | Record a Verdict (4, medium), restart the app | Persisted in `me/verdicts.yaml` with Patch and date; shown apart from statistics | US3, SC-004 |
| V6 | Review: approve one, reject one, flag a Conflict between different sections | Badge removed / entry deleted from its file / flag refused with a reason | US5 |
| V7 | Open Wave Management, then follow "Applied in" | Insights with no Patch; link leads to the Orianna vs Syndra section | US6, SC-002 |
| V8 | Disconnect the network, use the app | Everything works | SC-010 |
| V9 | `npm run test:e2e` | Playwright flows pass: study a Matchup (V2), record a Verdict (V5), live reload (V3) | E2E |
