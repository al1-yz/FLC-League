/**
 * Refreshes the Catalog from Riot's Data Dragon into the Content Repository (FR-001).
 * The only code in LoLMechs that uses the network. Run with: npm run catalog:refresh
 *
 * Writes <content>/catalog/catalog.json, icons/<id>.png for every champion, and
 * splash/<id>.jpg for each Focus Champion, using the skin named in config/skins.yaml.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

const DATA_DRAGON = "https://ddragon.leagueoflegends.com";

type DDChampion = { id: string; name: string; image: { full: string } };
type DDSkin = { num: number; name: string };
type DDRuneTree = { id: number; name: string; slots: { runes: { id: number; name: string }[] }[] };

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return (await response.json()) as T;
}

async function download(url: string, path: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
}

async function readYaml<T>(path: string, fallback: T): Promise<T> {
  return existsSync(path) ? ((parse(await readFile(path, "utf8")) as T) ?? fallback) : fallback;
}

/** Runs tasks with a small concurrency limit, to stay polite to the CDN. */
async function inBatches<T>(items: T[], size: number, task: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(task));
}

async function main() {
  const contentDir = process.env.LOLMECHS_CONTENT_DIR || process.argv[2];
  if (!contentDir) throw new Error("Set LOLMECHS_CONTENT_DIR (or pass the content directory as an argument).");

  const catalogDir = join(contentDir, "catalog");
  await mkdir(join(catalogDir, "icons"), { recursive: true });
  await mkdir(join(catalogDir, "splash"), { recursive: true });

  const [version] = await getJson<string[]>(`${DATA_DRAGON}/api/versions.json`);
  const patch = version.split(".").slice(0, 2).join(".");
  const cdn = `${DATA_DRAGON}/cdn/${version}`;

  const champions = Object.values(
    (await getJson<{ data: Record<string, DDChampion> }>(`${cdn}/data/en_US/champion.json`)).data,
  );
  const items = (await getJson<{ data: Record<string, { name: string }> }>(`${cdn}/data/en_US/item.json`)).data;
  const runeTrees = await getJson<DDRuneTree[]>(`${cdn}/data/en_US/runesReforged.json`);

  const focus = await readYaml<Record<string, string[]>>(join(contentDir, "config", "focus-champions.yaml"), {});
  const focusIds = new Set(Object.values(focus).flat());
  const wantedSkins = await readYaml<Record<string, string>>(join(contentDir, "config", "skins.yaml"), {});

  await inBatches(champions, 8, (c) =>
    download(`${cdn}/img/champion/${c.image.full}`, join(catalogDir, "icons", `${c.id.toLowerCase()}.png`)),
  );

  const splashes = new Map<string, string>();
  for (const c of champions.filter((c) => focusIds.has(c.id.toLowerCase()))) {
    const id = c.id.toLowerCase();
    const detail = await getJson<{ data: Record<string, { skins: DDSkin[] }> }>(
      `${cdn}/data/en_US/champion/${c.id}.json`,
    );
    const skins = detail.data[c.id].skins;
    const wanted = wantedSkins[id];
    let skin = skins.find((s) => s.name.toLowerCase() === wanted?.toLowerCase());
    if (wanted && !skin) {
      console.warn(`  ! Skin "${wanted}" not found for ${c.name}. Available: ${skins.map((s) => s.name).join(", ")}`);
    }
    skin ??= skins[0];
    await download(`${DATA_DRAGON}/cdn/img/champion/splash/${c.id}_${skin.num}.jpg`, join(catalogDir, "splash", `${id}.jpg`));
    splashes.set(id, skin.name === "default" ? c.name : skin.name);
  }

  const catalog = {
    currentPatch: patch,
    dataDragonVersion: version,
    refreshedAt: new Date().toISOString().slice(0, 10),
    champions: champions
      .map((c) => {
        const id = c.id.toLowerCase();
        return {
          id,
          name: c.name,
          icon: `icons/${id}.png`,
          ...(splashes.has(id) && { splash: `splash/${id}.jpg`, skin: splashes.get(id) }),
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id)),
    items: Object.entries(items).map(([id, item]) => ({ id, name: item.name })),
    runes: runeTrees.flatMap((tree) => [
      { id: String(tree.id), name: tree.name },
      ...tree.slots.flatMap((slot) => slot.runes.map((r) => ({ id: String(r.id), name: r.name }))),
    ]),
  };
  await writeFile(join(catalogDir, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

  console.log(`Catalog updated to ${patch} (Data Dragon ${version}): ${champions.length} champions, ${splashes.size} splash arts.`);
  for (const [id, skin] of splashes) console.log(`  ${id}: ${skin}`);
}

main().catch((error) => {
  console.error(`Catalog refresh failed: ${error.message}`);
  process.exit(1);
});
