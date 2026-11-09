/** Where the Content Repository lives; falls back to the public demo content. */
export function contentDir(): string {
  return process.env.LOLMECHS_CONTENT_DIR || "demo-content";
}
