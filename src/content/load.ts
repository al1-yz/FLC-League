import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import { sectionsFor, type ChampionId, type Lane, type MatchupKey } from "./domain";
import { catalogFile, focusChampionsFile, matchupFile, matchupInsight, sourceFile } from "./schemas";

type Insight = z.infer<typeof matchupInsight>;

export type InsightView = Omit<Insight, "source"> & { source: { id: string; name: string } };

export type MatchupView = {
  key: MatchupKey;
  lane: Lane;
  perspective: ChampionId;
  /** Perspective champion first, Opponent second. */
  champions: [{ id: ChampionId; name: string }, { id: ChampionId; name: string }];
  sections: { id: string; title: string; insights: InsightView[] }[];
};

export type FocusChampion = { id: ChampionId; name: string; lane: Lane };

export type KnowledgeBase = {
  focusChampions(lane: Lane): FocusChampion[];
  matchup(key: MatchupKey, perspective: ChampionId): MatchupView;
};

export type ValidationReport = { issues: { file: string; rule: string; message: string }[] };

function readYaml(path: string): unknown {
  return parse(readFileSync(path, "utf8"));
}

function yamlFiles(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".yaml")) : [];
}

export function loadKnowledgeBase(contentDir: string): { kb: KnowledgeBase; report: ValidationReport } {
  const catalog = catalogFile.parse(
    JSON.parse(readFileSync(join(contentDir, "catalog", "catalog.json"), "utf8")),
  );
  const championName = (id: ChampionId) => catalog.champions.find((c) => c.id === id)?.name ?? id;

  const focus = focusChampionsFile.parse(readYaml(join(contentDir, "config", "focus-champions.yaml")));

  const sources = new Map<string, { id: string; name: string }>();
  for (const file of yamlFiles(join(contentDir, "sources"))) {
    const id = basename(file, ".yaml");
    sources.set(id, { id, name: sourceFile.parse(readYaml(join(contentDir, "sources", file))).name });
  }

  const matchups = new Map<MatchupKey, z.infer<typeof matchupFile>>();
  for (const lane of ["mid", "bot"] as const) {
    const dir = join(contentDir, "matchups", lane);
    for (const file of yamlFiles(dir)) {
      matchups.set(`${lane}/${basename(file, ".yaml")}`, matchupFile.parse(readYaml(join(dir, file))));
    }
  }

  const kb: KnowledgeBase = {
    focusChampions(lane) {
      return focus[lane].map((id) => ({ id, name: championName(id), lane }));
    },
    matchup(key, perspective) {
      const m = matchups.get(key);
      if (!m) throw new Error(`Unknown Matchup: ${key}`);
      const opponent = m.champions[0] === perspective ? m.champions[1] : m.champions[0];
      return {
        key,
        lane: m.lane,
        perspective,
        champions: [
          { id: perspective, name: championName(perspective) },
          { id: opponent, name: championName(opponent) },
        ],
        sections: sectionsFor(m.lane).map((s) => ({
          id: s.id,
          title: s.title,
          insights: m.insights
            .filter((i) => i.section === s.id)
            .map((i) => ({ ...i, source: sources.get(i.source) ?? { id: i.source, name: i.source } })),
        })),
      };
    },
  };

  return { kb, report: { issues: [] } };
}
