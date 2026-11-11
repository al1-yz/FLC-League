import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import { SECTION_GROUPS, sectionsFor, type ChampionId, type Lane, type MatchupKey } from "./domain";
import { archetypesFile, catalogFile, championFile, focusChampionsFile, matchupFile, matchupInsight, sourceFile } from "./schemas";

type Insight = z.infer<typeof matchupInsight>;

export type InsightView = Omit<Insight, "source"> & { source: { id: string; name: string } };

export type MatchupView = {
  key: MatchupKey;
  lane: Lane;
  perspective: ChampionId;
  /** Perspective champion first, Opponent second. */
  champions: [ChampionView, ChampionView];
  groups: { id: string; title: string; sections: SectionView[] }[];
};

export type SectionView = { id: string; title: string; insights: InsightView[] };

export type ChampionView = { id: ChampionId; name: string; icon?: string; splash?: string; skin?: string };

export type FocusChampion = { id: ChampionId; name: string; lane: Lane };

export type ChampionProfile = ChampionView & {
  primaryArchetype?: string;
  secondaryArchetype?: string;
  species?: string;
};

export type MatchupSummary = { key: MatchupKey; lane: Lane; opponent: ChampionView; insights: number };

export type KnowledgeBase = {
  currentPatch(): string;
  champion(id: ChampionId): ChampionView;
  profile(id: ChampionId): ChampionProfile;
  matchupsFor(focus: ChampionId, lane: Lane): MatchupSummary[];
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
  const champion = (id: ChampionId): ChampionView => {
    const c = catalog.champions.find((c) => c.id === id);
    return {
      id,
      name: c?.name ?? id,
      icon: c?.icon && `/catalog/${c.icon}`,
      splash: c?.splash && `/catalog/${c.splash}`,
      skin: c?.skin,
    };
  };
  const championName = (id: ChampionId) => champion(id).name;

  const focus = focusChampionsFile.parse(readYaml(join(contentDir, "config", "focus-champions.yaml")));

  const archetypesPath = join(contentDir, "config", "archetypes.yaml");
  const archetypes = existsSync(archetypesPath) ? archetypesFile.parse(readYaml(archetypesPath)) : [];
  const archetypeName = (id?: string) => archetypes.find((a) => a.id === id)?.name ?? id;

  const profiles = new Map<ChampionId, z.infer<typeof championFile>>();
  for (const file of yamlFiles(join(contentDir, "champions"))) {
    profiles.set(basename(file, ".yaml"), championFile.parse(readYaml(join(contentDir, "champions", file))));
  }

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
    currentPatch: () => catalog.currentPatch,
    champion,
    profile(id) {
      const p = profiles.get(id);
      return {
        ...champion(id),
        primaryArchetype: archetypeName(p?.primaryArchetype),
        secondaryArchetype: archetypeName(p?.secondaryArchetype),
        species: p?.species,
      };
    },
    matchupsFor(focus, lane) {
      return [...matchups.entries()]
        .filter(([, m]) => m.lane === lane && m.champions.includes(focus))
        .map(([key, m]) => ({
          key,
          lane,
          opponent: champion(m.champions[0] === focus ? m.champions[1] : m.champions[0]),
          insights: m.insights.length,
        }));
    },
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
        champions: [champion(perspective), champion(opponent)],
        groups: SECTION_GROUPS.map((g) => ({
          id: g.id,
          title: g.title,
          sections: sectionsFor(m.lane)
            .filter((s) => s.group === g.id)
            .map((s) => ({
              id: s.id,
              title: s.title,
              insights: m.insights
                .filter((i) => i.section === s.id)
                .map((i) => ({ ...i, source: sources.get(i.source) ?? { id: i.source, name: i.source } })),
            })),
        })),
      };
    },
  };

  return { kb, report: { issues: [] } };
}
