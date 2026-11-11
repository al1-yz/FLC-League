/**
 * PROTOTYPE — SAMPLE DATA ONLY. Throwaway generator for the statistics design prototype
 * (docs/discovery/decisions.md D15.4). Numbers are invented, deterministic per champion,
 * and must never be shown outside /prototype. Real figures come from feature 002.
 */

function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export type SampleOpponent = { id: string; games: number; winRate: number };
export type SampleArchetype = { name: string; games: number; winRate: number };

export function sampleStats(championId: string, opponentIds: string[]) {
  const r = seeded(championId);
  const between = (min: number, max: number) => min + r() * (max - min);

  const winRate = between(47.5, 53.5);
  return {
    winRate,
    pickRate: between(2, 9),
    banRate: between(0.3, 6),
    games: Math.round(between(40_000, 90_000)),
    tier: ["S", "A", "B", "C"][Math.floor(r() * 4)],
    byGameLength: ["0–15", "15–20", "20–25", "25–30", "30–35", "35–40", "40+"].map((label, i) => ({
      label,
      winRate: winRate + Math.sin(i * 0.9 + r() * 2) * 3 + (i - 3) * between(-0.6, 0.9),
    })),
    byLevel: Array.from({ length: 18 }, (_, i) => ({ level: i + 1, delta: Math.sin(i / 2.4 + r()) * between(0.5, 3.5) })),
    opponents: opponentIds.map<SampleOpponent>((id) => ({
      id,
      games: Math.round(between(150, 3_000)),
      winRate: between(43, 57),
    })),
    archetypes: ["Control Mage", "Assassin", "Battlemage", "Burst Mage", "Artillery Mage", "Skirmisher"].map<SampleArchetype>(
      (name) => ({ name, games: Math.round(between(1_000, 14_000)), winRate: between(45, 55.5) }),
    ),
    damage: (() => {
      const magic = between(70, 90);
      const physical = between(4, 100 - magic - 2);
      return { magic, physical, true: 100 - magic - physical };
    })(),
    byPhase: [
      { phase: "Early", winRate: between(46, 54) },
      { phase: "Mid", winRate: between(46, 54) },
      { phase: "Late", winRate: between(46, 55) },
    ],
    buildPath: ["Starter", "First item", "Second item", "Third item", "Situational"].map((step) => ({
      step,
      winRate: between(46, 57),
      games: Math.round(between(800, 30_000)),
    })),
  };
}
