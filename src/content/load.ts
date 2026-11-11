import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import { readList } from "../user-data/files";
import type { MeNoteRecord, VerdictRecord } from "../user-data";
import { SECTION_GROUPS, sectionsFor, type ChampionId, type Lane, type MatchupKey } from "./domain";
import {
  RANK_FILTERS,
  archetypesFile,
  catalogFile,
  championFile,
  conflictEntry,
  focusChampionsFile,
  looseInsight,
  looseMatchupFile,
  sourceFile,
  thirdPartyReference,
} from "./schemas";

type Insight = z.infer<typeof looseInsight> & { link: string; patch: string };
type Reference = z.infer<typeof thirdPartyReference>;
type Conflict = z.infer<typeof conflictEntry>;
type Matchup = { lane: Lane; champions: [ChampionId, ChampionId]; insights: Insight[]; references: Reference[]; conflicts: Conflict[] };

/** "you" = about the Focus Champion being viewed, "opponent" = about the other side, "shared" = both. */
export type Side = "you" | "opponent" | "shared";

export type InsightView = Omit<Insight, "source"> & {
  source: { id: string; name: string };
  side: Side;
  /** From a Patch older than the current one (FR-020). */
  outdated: boolean;
};

export type MatchupView = {
  key: MatchupKey;
  lane: Lane;
  perspective: ChampionId;
  /** Perspective champion first, Opponent second. */
  champions: [ChampionView, ChampionView];
  /** The other champion, when both are Focus Champions of this Lane (FR-017). */
  switchTo?: ChampionId;
  /** The user's latest Verdict and earlier ones, newest first (FR-022a). */
  verdict?: { latest: Verdict; history: Verdict[] };
  groups: { id: string; title: string; sections: SectionView[] }[];
};

export type SectionView = {
  id: string;
  title: string;
  /** Current-Patch Insights first, then older ones (FR-020). */
  insights: InsightView[];
  /** Pairs of conflicting Insight ids, shown side by side (FR-021). */
  conflicts: [string, string][];
  /** Power spikes only: Insights grouped by level, then item, then the rest (FR-016). */
  spikeGroups?: { label: string; insights: InsightView[] }[];
  /** The user's own notes on this Section (FR-023). */
  meNotes: { id: string; text: string; createdAt: string; updatedAt: string }[];
};

export type Verdict = Omit<VerdictRecord, "matchup">;

export type ChampionView = { id: ChampionId; name: string; icon?: string; splash?: string; skin?: string };

export type FocusChampion = { id: ChampionId; name: string; lane: Lane };

export type ChampionProfile = ChampionView & {
  primaryArchetype?: string;
  secondaryArchetype?: string;
  species?: string;
};

/** A champion-level Insight (no Section or side), e.g. a general power curve (FR-032). */
export type ChampionInsightView = Omit<InsightView, "section" | "about" | "side" | "spike">;

export type OpponentView = ChampionProfile & { insights: ChampionInsightView[]; matchups: { key: MatchupKey; lane: Lane; other: ChampionView }[] };

export type MatchupSummary = {
  key: MatchupKey;
  lane: Lane;
  opponent: ChampionView;
  opponentArchetype?: string;
  /** Latest Verdict difficulty, if any (FR-029). */
  verdict?: number;
  insights: number;
  unreviewed: number;
};

export type KnowledgeBase = {
  currentPatch(): string;
  /** Every Catalog champion, for the Matchup search (FR-031). */
  champions(): ChampionView[];
  champion(id: ChampionId): ChampionView;
  profile(id: ChampionId): ChampionProfile;
  matchupsFor(focus: ChampionId, lane: Lane): MatchupSummary[];
  focusChampions(lane: Lane): FocusChampion[];
  matchup(key: MatchupKey, perspective: ChampionId): MatchupView;
  opponent(id: ChampionId): OpponentView;
};

/** One rejected entry or file: where it is, which load rule it breaks, and why (FR-009). */
export type ValidationIssue = { file: string; entryId?: string; rule: string; message: string };
export type ValidationReport = { issues: ValidationIssue[] };

const QUOTE_LIMIT = 200;

function comparePatch(a: string, b: string): number {
  const [a1, a2] = a.split(".").map(Number);
  const [b1, b2] = b.split(".").map(Number);
  return a1 - b1 || a2 - b2;
}
const PATCH_FORMAT = /^\d+\.\d+$/;

function readYaml(path: string): unknown {
  return parse(readFileSync(path, "utf8"));
}

function yamlFiles(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort() : [];
}

function sentenceCount(text: string): number {
  return (text.trim().match(/[.!?](\s|$)/g) ?? []).length;
}

export function loadKnowledgeBase(contentDir: string): { kb: KnowledgeBase; report: ValidationReport } {
  const issues: ValidationIssue[] = [];
  const report = (file: string, rule: string, message: string, entryId?: string) =>
    issues.push({ file, rule, message, ...(entryId !== undefined && { entryId }) });

  const catalog = catalogFile.parse(JSON.parse(readFileSync(join(contentDir, "catalog", "catalog.json"), "utf8")));
  const inCatalog = (id: ChampionId) => catalog.champions.some((c) => c.id === id);
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

  const focus = focusChampionsFile.parse(readYaml(join(contentDir, "config", "focus-champions.yaml")));

  const archetypesPath = join(contentDir, "config", "archetypes.yaml");
  const archetypes = existsSync(archetypesPath) ? archetypesFile.parse(readYaml(archetypesPath)) : [];
  const archetypeName = (id?: string) => archetypes.find((a) => a.id === id)?.name;

  // Champion profiles (R-ARCH): unknown Archetypes and a secondary equal to the primary are dropped.
  const profiles = new Map<ChampionId, z.infer<typeof championFile>>();
  const championInsights = new Map<ChampionId, Insight[]>();
  for (const file of yamlFiles(join(contentDir, "champions"))) {
    const where = `champions/${file}`;
    const parsed = championFile.safeParse(readYaml(join(contentDir, "champions", file)));
    if (!parsed.success) {
      report(where, "R-SHAPE", `Not a valid champion profile: ${parsed.error.issues[0]?.message}`);
      continue;
    }
    const profile = { ...parsed.data };
    for (const key of ["primaryArchetype", "secondaryArchetype"] as const) {
      if (profile[key] && !archetypeName(profile[key])) {
        report(where, "R-ARCH", `"${profile[key]}" is not in the approved Archetype list.`);
        delete profile[key];
      }
    }
    if (profile.secondaryArchetype && profile.secondaryArchetype === profile.primaryArchetype) {
      report(where, "R-ARCH", "The Secondary Archetype must differ from the Primary Archetype.");
      delete profile.secondaryArchetype;
    }
    profiles.set(basename(file, ".yaml"), profile);
  }

  const sources = new Map<string, { id: string; name: string; medium: string }>();
  for (const file of yamlFiles(join(contentDir, "sources"))) {
    const id = basename(file, ".yaml");
    const parsed = sourceFile.safeParse(readYaml(join(contentDir, "sources", file)));
    if (parsed.success) sources.set(id, { id, name: parsed.data.name, medium: parsed.data.medium });
    else report(`sources/${file}`, "R-SRC", `Not a valid Source: ${parsed.error.issues[0]?.message}`);
  }

  const seenIds = new Set<string>();

  /** Checks shared by every external Insight: id, Source and link, Patch, quote (I1–I3). */
  const checkCommon = (where: string, i: z.infer<typeof looseInsight> | Omit<z.infer<typeof looseInsight>, "section" | "about">) => {
    if (seenIds.has(i.id)) report(where, "R-ID", `Insight id "${i.id}" is already used.`, i.id);
    const source = sources.get(i.source);
    if (!source) report(where, "R-SRC", `Source "${i.source}" does not exist.`, i.id);
    else if (!i.link) report(where, "R-SRC", "External Insights need a link.", i.id);
    else if (source.medium === "video" && !i.locator) report(where, "R-SRC", "Video Sources need a timestamp (locator).", i.id);
    if (!i.patch || !PATCH_FORMAT.test(i.patch)) report(where, "R-PATCH", "Matchup and champion Insights need a Patch like 16.22.", i.id);
    if (i.quote && (i.quote.length > QUOTE_LIMIT || sentenceCount(i.quote) > 1))
      report(where, "R-QUOTE", `Quotes are limited to one sentence of at most ${QUOTE_LIMIT} characters.`, i.id);
  };

  for (const [id, profile] of profiles) {
    const where = `champions/${id}.yaml`;
    const list: Insight[] = [];
    for (const raw of profile.insights) {
      const entryId = typeof raw.id === "string" ? raw.id : undefined;
      const shaped = looseInsight.omit({ section: true, about: true, spike: true }).safeParse(raw);
      if (!shaped.success) {
        report(where, "R-SHAPE", `Malformed Insight: ${shaped.error.issues[0]?.path.join(".")} ${shaped.error.issues[0]?.message}`, entryId);
        continue;
      }
      const before = issues.length;
      checkCommon(where, shaped.data);
      if (issues.length > before) continue;
      seenIds.add(shaped.data.id);
      list.push({ ...shaped.data, section: "", about: id } as Insight);
    }
    championInsights.set(id, list);
  }
  const matchups = new Map<MatchupKey, Matchup>();

  for (const folder of ["mid", "bot"] as const) {
    for (const file of yamlFiles(join(contentDir, "matchups", folder))) {
      const where = `matchups/${folder}/${file}`;
      const parsed = looseMatchupFile.safeParse(readYaml(join(contentDir, "matchups", folder, file)));
      if (!parsed.success) {
        report(where, "R-SHAPE", `Not a valid Matchup file: ${parsed.error.issues[0]?.message}`);
        continue;
      }
      const { lane, champions, insights: rawInsights, references: rawReferences, conflicts: rawConflicts } = parsed.data;

      // File-level rules: a broken file is dropped whole.
      if (lane !== "mid" && lane !== "bot") {
        report(where, "R-LANE", `Lane "${lane}" is not supported; only mid and bot.`);
        continue;
      }
      if (lane !== folder) {
        report(where, "R-LANE", `Lane "${lane}" does not match the folder "${folder}".`);
        continue;
      }
      const [a, b] = champions;
      const sorted = [a, b].sort();
      if (a === b || basename(file, ".yaml") !== `${sorted[0]}--${sorted[1]}`) {
        report(where, "R-PAIR", `A Matchup needs two different champions, in a file named "${sorted[0]}--${sorted[1]}.yaml".`);
        continue;
      }
      const missing = champions.filter((c) => !inCatalog(c));
      if (missing.length) {
        report(where, "R-CHAMP", `Unknown champion(s): ${missing.join(", ")}. Refresh the Catalog or fix the id.`);
        continue;
      }
      if (!champions.some((c) => focus[lane].includes(c))) {
        report(where, "R-FOCUS", `Neither ${a} nor ${b} is a Focus Champion of ${lane}.`);
        continue;
      }

      // Entry-level rules: only the broken entry is dropped.
      const allowedSections = new Set<string>(sectionsFor(lane).map((s) => s.id));
      const insights: Insight[] = [];
      for (const raw of rawInsights) {
        const entryId = typeof raw.id === "string" ? raw.id : undefined;
        const shaped = looseInsight.safeParse(raw);
        if (!shaped.success) {
          report(where, "R-SHAPE", `Malformed Insight: ${shaped.error.issues[0]?.path.join(".")} ${shaped.error.issues[0]?.message}`, entryId);
          continue;
        }
        const i = shaped.data;
        const before = issues.length;
        checkCommon(where, i);
        if (!allowedSections.has(i.section)) report(where, "R-SECTION", `Section "${i.section}" does not exist in the ${lane} template.`, i.id);
        else if (i.spike && i.section !== "power-spikes") report(where, "R-SECTION", "Only Power spikes Insights can name a level or item spike.", i.id);
        if (i.about !== "both" && !champions.includes(i.about))
          report(where, "R-ABOUT", `"about" must be ${a}, ${b} or both.`, i.id);
        if (issues.length > before) continue;
        seenIds.add(i.id);
        insights.push(i as Insight);
      }

      const references: Reference[] = [];
      for (const raw of rawReferences) {
        const entryId = typeof raw.id === "string" ? raw.id : undefined;
        const shaped = thirdPartyReference.safeParse(raw);
        if (!shaped.success) {
          report(where, "R-SHAPE", `Malformed Third-party Reference: ${shaped.error.issues[0]?.path.join(".")} ${shaped.error.issues[0]?.message}`, entryId);
          continue;
        }
        const r = shaped.data;
        const before = issues.length;
        if (!sources.has(r.source)) report(where, "R-SRC", `Source "${r.source}" does not exist.`, r.id);
        if (!(RANK_FILTERS as readonly string[]).includes(r.rankFilter))
          report(where, "R-RANK", `Rank filter "${r.rankFilter}" is below Emerald; statistics cover Emerald+ only.`, r.id);
        if (issues.length === before) references.push(r);
      }

      const conflicts: Conflict[] = [];
      for (const raw of rawConflicts) {
        const entryId = typeof raw.id === "string" ? raw.id : undefined;
        const shaped = conflictEntry.safeParse(raw);
        if (!shaped.success) {
          report(where, "R-CONFLICT", "A Conflict links exactly two Insight ids.", entryId);
          continue;
        }
        const [x, y] = shaped.data.insights.map((id) => insights.find((i) => i.id === id));
        if (!x || !y || x === y) report(where, "R-CONFLICT", "A Conflict must link two different, valid Insights of this Matchup.", shaped.data.id);
        else if (x.section !== y.section) report(where, "R-CONFLICT", `Conflicting Insights must share a Section ("${x.section}" ≠ "${y.section}").`, shaped.data.id);
        else conflicts.push(shaped.data);
      }

      matchups.set(`${lane}/${basename(file, ".yaml")}`, { lane, champions: [a, b], insights, references, conflicts });
    }
  }

  const verdicts = readList<VerdictRecord>(contentDir, "verdicts.yaml");
  const meNotes = readList<MeNoteRecord>(contentDir, "notes.yaml");
  const approved = new Set(readList<string>(contentDir, "review.yaml"));
  const isUnreviewed = (i: Insight) => i.collectedBy === "claude" && !approved.has(i.id);

  /** A Matchup without a content file still exists if it is a valid pair with a Focus Champion (FR-031). */
  const matchupOrEmpty = (key: MatchupKey): Matchup | undefined => {
    const found = matchups.get(key);
    if (found) return found;
    const [lane, pair] = key.split("/");
    const [a, b] = pair?.split("--") ?? [];
    if ((lane !== "mid" && lane !== "bot") || !a || !b || a === b || [a, b].sort()[0] !== a) return undefined;
    if (!inCatalog(a) || !inCatalog(b) || !(focus[lane].includes(a) || focus[lane].includes(b))) return undefined;
    return { lane, champions: [a, b], insights: [], references: [], conflicts: [] };
  };
  const latestVerdict = (key: MatchupKey) =>
    verdicts.filter((v) => v.matchup === key).sort((x, y) => comparePatch(y.patch, x.patch))[0];

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
    champions: () => catalog.champions.map((c) => champion(c.id)),
    matchupsFor(focusId, lane) {
      const keys = new Set([
        ...matchups.keys(),
        ...verdicts.map((v) => v.matchup),
        ...meNotes.flatMap((n) => ("matchup" in n.target ? [n.target.matchup] : [])),
      ]);
      return [...keys]
        .map((key) => [key, matchupOrEmpty(key)] as const)
        .filter((entry): entry is readonly [string, Matchup] => Boolean(entry[1]))
        .filter(([, m]) => m.lane === lane && m.champions.includes(focusId))
        .map(([key, m]) => {
          const opponentId = m.champions[0] === focusId ? m.champions[1] : m.champions[0];
          return {
            key,
            lane,
            opponent: champion(opponentId),
            opponentArchetype: archetypeName(profiles.get(opponentId)?.primaryArchetype),
            verdict: latestVerdict(key)?.difficulty,
            insights: m.insights.length,
            unreviewed: m.insights.filter(isUnreviewed).length,
          };
        })
        .sort((x, y) => x.opponent.name.localeCompare(y.opponent.name));
    },
    opponent(id) {
      const { insights: _, ...profile } = { ...kb.profile(id), insights: undefined };
      const allKeys = new Set([...matchups.keys(), ...verdicts.map((v) => v.matchup)]);
      return {
        ...profile,
        insights: (championInsights.get(id) ?? [])
          .map(({ section: _s, about: _a, spike: _sp, ...i }) => {
            const { id: sourceId, name } = sources.get(i.source)!;
            return { ...i, source: { id: sourceId, name }, outdated: comparePatch(i.patch, catalog.currentPatch) < 0 };
          })
          .sort((a, b) => comparePatch(b.patch, a.patch)),
        matchups: [...allKeys]
          .map((key) => [key, matchupOrEmpty(key)] as const)
          .filter((entry): entry is readonly [string, Matchup] => Boolean(entry[1]) && entry[1]!.champions.includes(id))
          .map(([key, m]) => ({ key, lane: m.lane, other: champion(m.champions[0] === id ? m.champions[1] : m.champions[0]) })),
      };
    },
    focusChampions(lane) {
      return focus[lane].map((id) => ({ id, name: champion(id).name, lane }));
    },
    matchup(key, perspective) {
      const m = matchupOrEmpty(key);
      if (!m) throw new Error(`Unknown Matchup: ${key}`);
      const opponent = m.champions[0] === perspective ? m.champions[1] : m.champions[0];
      const bothFocus = m.champions.every((c) => focus[m.lane].includes(c));
      const itemName = (id: string) => catalog.items.find((item) => item.id === id)?.name ?? `Item ${id}`;

      const toView = (i: Insight): InsightView => {
        const { id, name } = sources.get(i.source)!;
        return {
          ...i,
          source: { id, name },
          side: i.about === "both" ? "shared" : i.about === perspective ? "you" : "opponent",
          outdated: comparePatch(i.patch, catalog.currentPatch) < 0,
        };
      };
      const freshestFirst = (a: InsightView, b: InsightView) => comparePatch(b.patch, a.patch);

      return {
        key,
        lane: m.lane,
        perspective,
        champions: [champion(perspective), champion(opponent)],
        ...(bothFocus && { switchTo: opponent }),
        ...(() => {
          const mine = verdicts
            .filter((v) => v.matchup === key)
            .map(({ matchup: _, ...v }) => v)
            .sort((a, b) => comparePatch(b.patch, a.patch));
          return mine.length ? { verdict: { latest: mine[0], history: mine.slice(1) } } : {};
        })(),
        groups: SECTION_GROUPS.map((g) => ({
          id: g.id,
          title: g.title,
          sections: sectionsFor(m.lane)
            .filter((s) => s.group === g.id)
            .map((s) => {
              const insights = m.insights.filter((i) => i.section === s.id).map(toView).sort(freshestFirst);
              const ids = new Set(insights.map((i) => i.id));
              const view: SectionView = {
                id: s.id,
                title: s.title,
                insights,
                conflicts: m.conflicts.filter((c) => ids.has(c.insights[0])).map((c) => c.insights),
                meNotes: meNotes
                  .filter((n) => "matchup" in n.target && n.target.matchup === key && n.target.section === s.id)
                  .map(({ id, text, createdAt, updatedAt }) => ({ id, text, createdAt, updatedAt })),
              };
              if (s.id === "power-spikes") {
                const byLevel = new Map<number, InsightView[]>();
                const byItem = new Map<string, InsightView[]>();
                const general: InsightView[] = [];
                for (const i of insights) {
                  if (i.spike && "level" in i.spike) byLevel.set(i.spike.level, [...(byLevel.get(i.spike.level) ?? []), i]);
                  else if (i.spike && "item" in i.spike) byItem.set(i.spike.item, [...(byItem.get(i.spike.item) ?? []), i]);
                  else general.push(i);
                }
                view.spikeGroups = [
                  ...[...byLevel].sort(([a], [b]) => a - b).map(([level, list]) => ({ label: `Level ${level}`, insights: list })),
                  ...[...byItem].map(([item, list]) => ({ label: itemName(item), insights: list })),
                  ...(general.length ? [{ label: "General", insights: general }] : []),
                ];
              }
              return view;
            }),
        })),
      };
    },
  };

  return { kb, report: { issues } };
}
