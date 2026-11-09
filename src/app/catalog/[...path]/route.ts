import { readFile } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { contentDir } from "@/content/config";

const TYPES: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };

/** Serves Catalog images (icons, splash art) from the Content Repository. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const relative = normalize(path.join("/"));
  const type = TYPES[extname(relative)];
  if (!type || relative.startsWith("..")) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(join(contentDir(), "catalog", relative));
    return new Response(file, { headers: { "content-type": type, "cache-control": "public, max-age=86400" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
