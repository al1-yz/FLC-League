import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

/** The user's own data lives only under `me/` in the Content Repository (FR-026b). */
export function mePath(dir: string, file: string): string {
  return join(dir, "me", file);
}

export function readList<T>(dir: string, file: string): T[] {
  const path = mePath(dir, file);
  return existsSync(path) ? ((parse(readFileSync(path, "utf8")) as T[] | null) ?? []) : [];
}

/** Writes to a temporary file, then renames it into place, so a crash never leaves half a file. */
export function writeList<T>(dir: string, file: string, list: T[]): void {
  mkdirSync(join(dir, "me"), { recursive: true });
  const path = mePath(dir, file);
  writeFileSync(`${path}.tmp`, stringify(list));
  renameSync(`${path}.tmp`, path);
}
