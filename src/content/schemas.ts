import { z } from "zod";
import { SECTIONS } from "./domain";

const sectionIds = SECTIONS.map((s) => s.id) as [string, ...string[]];

export const sourceFile = z.object({
  name: z.string(),
  kind: z.enum(["official", "third-party-statistic", "coaching"]),
  medium: z.enum(["video", "article", "podcast", "data", "other"]),
  homeLink: z.url(),
});

export const matchupInsight = z.object({
  id: z.string(),
  section: z.enum(sectionIds),
  about: z.string(),
  claim: z.string(),
  quote: z.string().optional(),
  source: z.string(),
  link: z.url(),
  locator: z.string().optional(),
  patch: z.string(),
  noted: z.string(),
  collectedBy: z.enum(["claude", "user"]),
});

export const matchupFile = z.object({
  lane: z.enum(["mid", "bot"]),
  champions: z.tuple([z.string(), z.string()]),
  insights: z.array(matchupInsight).default([]),
});

export const catalogFile = z.object({
  currentPatch: z.string(),
  refreshedAt: z.string(),
  champions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      icon: z.string().optional(),
      splash: z.string().optional(),
      skin: z.string().optional(),
    }),
  ),
  items: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
});

export const focusChampionsFile = z.object({
  mid: z.array(z.string()).default([]),
  bot: z.array(z.string()).default([]),
});

export const archetypesFile = z.array(z.object({ id: z.string(), name: z.string() }));

export const championFile = z.object({
  primaryArchetype: z.string().optional(),
  secondaryArchetype: z.string().optional(),
  species: z.string().optional(),
  insights: z.array(z.record(z.string(), z.unknown())).default([]),
});

/** Loose shapes used while validating (D20.1): rules are checked explicitly and reported, not thrown. */
export const looseMatchupFile = z.object({
  lane: z.string(),
  champions: z.tuple([z.string(), z.string()]),
  insights: z.array(z.record(z.string(), z.unknown())).default([]),
  references: z.array(z.record(z.string(), z.unknown())).default([]),
  conflicts: z.array(z.record(z.string(), z.unknown())).default([]),
});

export const looseInsight = z.object({
  id: z.string(),
  section: z.string(),
  about: z.string(),
  claim: z.string(),
  quote: z.string().optional(),
  source: z.string(),
  link: z.string().optional(),
  locator: z.string().optional(),
  patch: z.string().optional(),
  noted: z.string(),
  collectedBy: z.enum(["claude", "user"]),
  spike: z.union([z.object({ level: z.number().int().min(1).max(18) }), z.object({ item: z.string() })]).optional(),
});

export const RANK_FILTERS = ["emerald_plus", "diamond_plus", "master_plus"] as const;

export const thirdPartyReference = z.object({
  id: z.string(),
  source: z.string(),
  link: z.url(),
  forChampion: z.string(),
  rankFilter: z.string(),
  patches: z.union([z.string(), z.object({ from: z.string(), to: z.string() })]),
  games: z.number().int().nonnegative(),
  winRate: z.number().optional(),
  extra: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  recorded: z.string(),
});

export const conflictEntry = z.object({ id: z.string(), insights: z.tuple([z.string(), z.string()]) });
