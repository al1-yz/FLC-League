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
});

export const focusChampionsFile = z.object({
  mid: z.array(z.string()).default([]),
  bot: z.array(z.string()).default([]),
});
