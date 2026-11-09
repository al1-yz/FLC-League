# Research: Matchup Knowledge Base (001)

Phase 0 of `/speckit-plan`. The stack itself was decided with the user (ADR 0004); this file resolves the remaining technical unknowns. Versions were checked against the npm registry on 2026-11-09.

## R1. Framework and runtime

- **Decision**: Next.js 16.x (App Router), React 19, Node 24 (already installed), run with `npm run dev` / `npm start` on localhost.
- **Rationale**: One project serves the pages, reads content files on the server (Server Components) and handles writes (Server Actions). Nothing is hosted.
- **TypeScript**: use the TypeScript version Next 16 supports officially (pinned in `package.json`). npm's latest is 7.0.2; adopt it only once Next documents support.
- **Alternatives**: Vite + Hono (two pieces), Tauri/Electron (see ADR 0004).

## R2. Content format and validation

- **Decision**: YAML via the `yaml` package (2.9.x), validated by **Zod 4** (4.6.x). The JSON Schema for Claude is generated with Zod 4's built-in `z.toJSONSchema()`, so no extra dependency is needed.
- **Rationale**: Per-field Zod errors map directly to the validation report (FR-009). The `yaml` Document API can delete one entry while preserving the rest of a file, including comments and formatting, which is needed for rejecting an Insight (FR-024, FR-026b).
- **Two validation layers**:
  1. **Shape**: Zod per file, for required fields, enums, the quote length limit, the Patch format, and Patch rules by subject.
  2. **Cross-entity rules** in plain TypeScript after all files load: unknown champion or Source, Focus rule (I4), duplicates (I5), lane-conditional sections (I6), Conflict rules (I17), unique Insight ids.
- **Alternatives**: Markdown with frontmatter, JSON (ADR 0004); JSON Schema validation with Ajv (rejected because the types would be duplicated).

## R3. Auto-reload when content changes (FR-026c)

- **Decision**: **chokidar** (6.x) watches the content repository from a server-side singleton. A Route Handler streams **Server-Sent Events**. A small client component listens and calls `router.refresh()`.
- **Rationale**: `router.refresh()` re-renders the Server Components without losing client state, so a half-typed Verdict form survives the reload. SSE is one-way and built into browsers, with no WebSocket server needed.
- **Caching**: the parsed knowledge base is cached in memory and dropped on any watcher event, then rebuilt on the next request. Pages render dynamically (no static generation), because content changes at runtime.
- **Alternatives**: polling (simpler but wasteful and laggy), WebSockets (two-way traffic isn't needed).

## R4. Writing the user's own data (FR-022–FR-026b)

- **Decision**: Server Actions write YAML files under `me/` in the content repository. Each write goes to a temporary file and is then renamed into place, so a crash can't leave a half-written file. The watcher then triggers a refresh.
- **Ownership**: Claude never writes under `me/`, and the app never writes outside `me/`, except for deleting a rejected Insight (FR-026b).
- **Reviewed state**: stored as approvals in `me/review.yaml` (Insight ids) rather than as a flag inside Claude's files. This keeps the ownership rule intact.

## R5. Data Dragon catalog refresh (FR-001)

- **Decision**: a CLI script, `npm run catalog:refresh`. It reads `versions.json`, downloads `champion.json`, `item.json` and `runesReforged.json` for the latest version, plus each champion's square icon, and writes `catalog/catalog.json` and `catalog/icons/` into the **content repository**.
- **Rationale**: the app never touches the network (ADR 0001, FR-040). Riot data stays out of the public repo, and icons are available offline (SC-010).
- **Patch mapping**: Data Dragon version `16.22.1` → Patch `16.22`, the first two parts, as Riot documents (see `docs/research/data-sources.md`).
- **Note**: Data Dragon can lag a patch release. The refresh output prints the version it found.

## R6. Radial graph

- **Decision**: D3 7.x is used only for **layout math** (radial positions with `d3-scale`/`d3-shape`). Drawing is React-rendered SVG.
- **Rationale**: React stays in control of the DOM, which keeps the graph accessible and testable. The table stays the default view (FR-029).

## R7. Styling

- **Decision**: Tailwind CSS 4.x with theme tokens set as CSS variables (dark background, glass panels, a teal accent, and difficulty colors at 5 levels plus a neutral), following `docs/design/reference-direction.webp`.

## R8. Testing (constitution VII)

- **Decision**: **Vitest** 5.x for the domain rules and validation, tested through the Content module's interface against fixture content folders in temporary directories. **Playwright** 1.65.x for 3 end-to-end flows (see quickstart).
- **Rule coverage**: one fixture per validated rule (SC-006). The test suite has a table listing rule ids to tests, so a missing rule fails the build.

## R9. Content repository location

- **Decision**: set with the environment variable `LOLMECHS_CONTENT_DIR` in `.env.local`, which git ignores. If it's missing, the app uses `./demo-content`, a small demo dataset the user writes and that is committed to the public repo (FR-026a).
