# Stack: Next.js run locally, YAML content files validated by Zod, no database (feature 001)

LoLMechs is a Next.js (TypeScript) app run locally with one command and used in the browser on localhost; nothing is hosted. Content lives as YAML files in a separate private content repository (one file per Matchup, General Concept and Source; the user's own data in separate files), validated by Zod schemas from which a JSON Schema is generated as documentation for Claude. Feature 001 has no database: the files are the storage. Supporting tools: Tailwind CSS, D3 for the radial graph, Vitest and Playwright for tests, and a command-line script for the Data Dragon catalog refresh.

## Considered Options
- Vite + React + a small Node server: lighter, but two pieces to wire together.
- Tauri/Electron desktop app: more setup, no portfolio benefit.
- Markdown + frontmatter or JSON for content: a weak fit for many small structured Insights, or painful to edit by hand.

## Consequences
Content is diffable and editable by Claude and the user without the app. Whether feature 002 (statistics) needs SQLite is decided when 002 is planned.
