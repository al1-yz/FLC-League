export type Lane = "mid" | "bot";
export type ChampionId = string;
/** `<lane>/<a>--<b>` with a < b alphabetically, so both orders give the same key. */
export type MatchupKey = string;

/** Groups of Sections on a Matchup page, in display order (D13.1, D15.1). */
export const SECTION_GROUPS = [
  { id: "overview", title: "Overview" },
  { id: "timeline", title: "Game timeline" },
  { id: "trading", title: "Trading" },
  { id: "windows", title: "Windows" },
  { id: "build", title: "Build" },
  { id: "statistics", title: "Statistics" },
] as const;

export type SectionGroupId = (typeof SECTION_GROUPS)[number]["id"];

/**
 * The fixed Matchup template, in display order. One topic per Section, no compound Sections (D13.1).
 * General Concepts (tethering, wave management, lane priority, roaming, map pressure…) are not
 * Matchup Sections: they live on their own General Concept pages (D15.1).
 */
export const SECTIONS = [
  { id: "overview", title: "Overview", group: "overview" },
  { id: "difficulty", title: "Difficulty", group: "overview" },
  { id: "win-conditions", title: "Win conditions", group: "overview" },
  { id: "support-influence", title: "Support influence", group: "overview", lane: "bot" },
  { id: "power-spikes", title: "Power spikes", group: "timeline" },
  { id: "early-game", title: "Early game", group: "timeline" },
  { id: "mid-game", title: "Mid game", group: "timeline" },
  { id: "late-game", title: "Late game", group: "timeline" },
  { id: "trading-patterns", title: "Trading patterns", group: "trading" },
  { id: "trading-stance", title: "Trading stance", group: "trading" },
  { id: "cooldown-windows", title: "Cooldown windows", group: "trading" },
  { id: "all-in-windows", title: "All-in windows", group: "windows" },
  { id: "kill-windows", title: "Kill windows", group: "windows" },
  { id: "defensive-windows", title: "Defensive windows", group: "windows" },
  { id: "runes", title: "Runes", group: "build" },
  { id: "summoner-spells", title: "Summoner spells", group: "build" },
  { id: "itemization", title: "Itemization", group: "build" },
  { id: "statistics", title: "Statistics", group: "statistics" },
] as const satisfies readonly { id: string; title: string; group: SectionGroupId; lane?: Lane }[];

export type SectionId = (typeof SECTIONS)[number]["id"];

export function sectionsFor(lane: Lane) {
  return SECTIONS.filter((s) => !("lane" in s) || s.lane === lane);
}
