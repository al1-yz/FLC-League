export type Lane = "mid" | "bot";
export type ChampionId = string;
/** `<lane>/<a>--<b>` with a < b alphabetically, so both orders give the same key. */
export type MatchupKey = string;

/** The fixed Matchup template, in display order. */
export const SECTIONS = [
  { id: "overview", title: "Overview & difficulty" },
  { id: "win-conditions", title: "Win conditions" },
  { id: "power-spikes", title: "Power spikes" },
  { id: "phase-advantage", title: "Early, mid & late game" },
  { id: "trading", title: "Trading patterns & stance" },
  { id: "tethering", title: "Tethering" },
  { id: "cooldown-windows", title: "Cooldown windows" },
  { id: "all-in-windows", title: "All-in & kill windows" },
  { id: "defensive-windows", title: "Defensive windows" },
  { id: "wave-and-priority", title: "Wave management & lane priority" },
  { id: "runes-and-spells", title: "Runes & summoner spells" },
  { id: "itemization", title: "Itemization" },
  { id: "roaming", title: "Roaming & map pressure", lane: "mid" },
  { id: "support-influence", title: "Support influence", lane: "bot" },
  { id: "statistics", title: "Statistics" },
] as const satisfies readonly { id: string; title: string; lane?: Lane }[];

export type SectionId = (typeof SECTIONS)[number]["id"];

export function sectionsFor(lane: Lane) {
  return SECTIONS.filter((s) => !("lane" in s) || s.lane === lane);
}
