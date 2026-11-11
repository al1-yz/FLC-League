/**
 * PROTOTYPE — throwaway design study for the Matchup statistics view (D15.4).
 * Uses invented sample data from src/prototype/sample-stats.ts. Not linked from navigation
 * except the "Open the prototype" button on Matchup pages.
 */
import { loadKnowledgeBase, type ChampionView } from "@/content";
import { contentDir } from "@/content/config";
import { sampleStats, type SampleArchetype, type SampleOpponent } from "@/prototype/sample-stats";

export const dynamic = "force-dynamic";

const SAMPLE_OPPONENTS = ["syndra", "ahri", "sylas", "viktor", "azir", "leblanc", "yasuo", "yone", "akali", "zed", "annie", "xerath"];

const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
const BLUSH = "#E5B8A8";
const LAVENDER = "#B8B3CA";

/** Lavender when the matchup favours you, blush when it threatens you. */
const tone = (winRate: number) => (winRate >= 50 ? LAVENDER : BLUSH);

export default async function StatsPrototype({ searchParams }: { searchParams: Promise<{ champion?: string }> }) {
  const { champion = "orianna" } = await searchParams;
  const { kb } = loadKnowledgeBase(contentDir());
  const you = kb.champion(champion);
  const opponents = SAMPLE_OPPONENTS.filter((id) => id !== champion).map((id) => kb.champion(id));
  const stats = sampleStats(champion, opponents.map((o) => o.id));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="reveal flex items-center gap-3 rounded-xl border border-blush-400/40 bg-blush-400/10 px-5 py-3 text-sm text-blush-300">
        <span className="pulse-soft size-2 rounded-full bg-blush-400" aria-hidden="true" />
        Prototype · sample data only. These numbers are invented to review the design — real statistics arrive with feature 002.
      </div>

      <header className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="eyebrow eyebrow--cool">Matchup analysis · Emerald+</p>
        <h1 className="mt-2 text-5xl font-medium tracking-tight">{you.name} in numbers</h1>
      </header>

      {/* Level-up style KPI row */}
      <section aria-label="Key figures" className="grid gap-4 md:grid-cols-4">
        <RingStat label="Win rate" value={stats.winRate} max={100} display={pct(stats.winRate, 2)} index={2} />
        <RingStat label="Pick rate" value={stats.pickRate} max={15} display={pct(stats.pickRate)} index={3} />
        <RingStat label="Ban rate" value={stats.banRate} max={15} display={pct(stats.banRate)} index={4} />
        <TierBadge tier={stats.tier} games={stats.games} index={5} />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel title="Influence map" subtitle="Who pulls your win rate up or down. Line weight = games played." className="lg:col-span-3" index={6}>
          <InfluenceGraph you={you} opponents={opponents} data={stats.opponents} />
        </Panel>
        <Panel title="Archetype handshake" subtitle="How you shake hands with each archetype." className="lg:col-span-2" index={7}>
          <Handshake archetypes={stats.archetypes} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Win rate by game length" subtitle="Where the game is won: early, mid or late." index={8}>
          <GameLengthChart points={stats.byGameLength} />
        </Panel>
        <Panel title="Level spikes" subtitle="Win-rate swing relative to your average, level by level." index={9}>
          <LevelStrip levels={stats.byLevel} />
        </Panel>
      </div>

      <Panel title="Build quest" subtitle="Your item path as a quest line. Each node: win rate and games." index={10}>
        <BuildQuest path={stats.buildPath} />
      </Panel>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className = "",
  index,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <section className={`panel reveal p-7 ${className}`} style={{ "--i": index } as React.CSSProperties}>
      <h2 className="text-lg font-medium text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-faint">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function RingStat({ label, value, max, display, index }: { label: string; value: number; max: number; display: string; index: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(value / max, 1);
  return (
    <div className="panel reveal flex items-center gap-5 p-5" style={{ "--i": index } as React.CSSProperties}>
      <svg viewBox="0 0 100 100" className="size-20 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(184 179 202 / 0.12)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={BLUSH}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference * filled} ${circumference}`}
          style={{ filter: "drop-shadow(0 0 6px rgb(229 184 168 / 0.6))" }}
        />
      </svg>
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">{label}</p>
        <p className="mt-1 text-3xl tabular-nums text-ink">{display}</p>
      </div>
    </div>
  );
}

function TierBadge({ tier, games, index }: { tier: string; games: number; index: number }) {
  const xp = Math.min(games / 100_000, 1);
  return (
    <div className="panel reveal p-5" style={{ "--i": index } as React.CSSProperties}>
      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl border border-blush-400/50 bg-blush-400/10 text-3xl font-medium text-blush-300 shadow-[0_0_24px_-6px_rgb(229_184_168/0.7)]">
          {tier}
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">Tier</p>
          <p className="mt-1 text-sm text-ink-muted">{games.toLocaleString("en")} games</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-lavender-300/10">
        <div className="h-full rounded-full bg-gradient-to-r from-blush-400 to-lavender-300" style={{ width: `${xp * 100}%` }} />
      </div>
      <p className="mt-1.5 text-[0.65rem] text-ink-faint">Sample size toward 100k games</p>
    </div>
  );
}

function InfluenceGraph({ you, opponents, data }: { you: ChampionView; opponents: ChampionView[]; data: SampleOpponent[] }) {
  const size = 440;
  const c = size / 2;
  const maxGames = Math.max(...data.map((d) => d.games));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[30rem]" role="img" aria-label="Influence map of opponents">
      <defs>
        <clipPath id="node-clip">
          <circle r="20" />
        </clipPath>
      </defs>
      {[70, 130, 190].map((ring) => (
        <circle key={ring} cx={c} cy={c} r={ring} fill="none" stroke="rgb(184 179 202 / 0.07)" />
      ))}
      {data.map((d, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        // Further out = more extreme matchup; distance encodes |delta| from 50%.
        const distance = 95 + Math.min(Math.abs(d.winRate - 50) * 14, 95);
        const x = c + Math.cos(angle) * distance;
        const y = c + Math.sin(angle) * distance;
        const opponent = opponents[i];
        return (
          <g key={d.id}>
            <line
              x1={c}
              y1={c}
              x2={x}
              y2={y}
              stroke={tone(d.winRate)}
              strokeOpacity="0.55"
              strokeWidth={1 + (d.games / maxGames) * 5}
              pathLength={1}
              className="draw-in"
            />
            <g transform={`translate(${x} ${y})`}>
              <circle r="23" fill="#1b1a16" stroke={tone(d.winRate)} strokeWidth="1.5" />
              {opponent.icon ? (
                <image href={opponent.icon} x="-20" y="-20" width="40" height="40" clipPath="url(#node-clip)" />
              ) : (
                <text textAnchor="middle" dy="4" fontSize="11" fill="#f2eeea">
                  {opponent.name.slice(0, 3)}
                </text>
              )}
              <text textAnchor="middle" y="38" fontSize="10.5" fill={tone(d.winRate)} className="tabular-nums">
                {pct(d.winRate)}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={c} cy={c} r="38" fill="#23211b" stroke={BLUSH} strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 14px rgb(229 184 168 / 0.6))" }} />
      {you.icon ? (
        <image href={you.icon} x={c - 34} y={c - 34} width="68" height="68" clipPath="url(#you-clip)" />
      ) : null}
      <clipPath id="you-clip">
        <circle cx={c} cy={c} r="34" />
      </clipPath>
      <g fontSize="10" fill="#857c78">
        <circle cx="16" cy={size - 26} r="4" fill={LAVENDER} />
        <text x="26" y={size - 22}>favours you</text>
        <circle cx="16" cy={size - 10} r="4" fill={BLUSH} />
        <text x="26" y={size - 6}>threatens you</text>
      </g>
    </svg>
  );
}

function Handshake({ archetypes }: { archetypes: SampleArchetype[] }) {
  const width = 340;
  const rowHeight = 46;
  const height = archetypes.length * rowHeight;
  const total = archetypes.reduce((n, a) => n + a.games, 0);
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Archetype handshake">
      {archetypes.map((a, i) => {
        const band = (a.games / total) * height;
        const y0 = offset + band / 2;
        offset += band;
        const y1 = i * rowHeight + rowHeight / 2;
        const thickness = Math.max(band - 2, 2);
        return (
          <g key={a.name}>
            <path
              d={`M 14 ${y0} C 150 ${y0}, 150 ${y1}, 210 ${y1}`}
              fill="none"
              stroke={tone(a.winRate)}
              strokeOpacity="0.35"
              strokeWidth={thickness}
            />
            <path d={`M 14 ${y0} C 150 ${y0}, 150 ${y1}, 210 ${y1}`} fill="none" stroke={tone(a.winRate)} strokeWidth="1" pathLength={1} className="draw-in" />
            <circle cx="214" cy={y1} r="4" fill={tone(a.winRate)} />
            <text x="226" y={y1 - 3} fontSize="12" fill="#f2eeea">
              {a.name}
            </text>
            <text x="226" y={y1 + 12} fontSize="10.5" fill={tone(a.winRate)} className="tabular-nums">
              {pct(a.winRate)} · {a.games.toLocaleString("en")}
            </text>
          </g>
        );
      })}
      <rect x="6" y="0" width="8" height={height} rx="4" fill={BLUSH} opacity="0.85" />
    </svg>
  );
}

function GameLengthChart({ points }: { points: { label: string; winRate: number }[] }) {
  const w = 480;
  const h = 220;
  const pad = 28;
  const min = 42;
  const max = 58;
  const x = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const line = points.map((p, i) => `${i ? "L" : "M"} ${x(i)} ${y(p.winRate)}`).join(" ");
  const area = `${line} L ${x(points.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;
  const phases = [
    { label: "Early", from: 0, to: 2 },
    { label: "Mid", from: 2, to: 4 },
    { label: "Late", from: 4, to: points.length - 1 },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Win rate by game length">
      <defs>
        <linearGradient id="len-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLUSH} stopOpacity="0.35" />
          <stop offset="1" stopColor={BLUSH} stopOpacity="0" />
        </linearGradient>
      </defs>
      {phases.map((p, i) => (
        <g key={p.label}>
          <rect x={x(p.from)} y={pad - 8} width={x(p.to) - x(p.from)} height={h - pad * 2 + 8} fill={i % 2 ? "rgb(184 179 202 / 0.04)" : "transparent"} />
          <text x={(x(p.from) + x(p.to)) / 2} y={pad - 12} textAnchor="middle" fontSize="10" fill="#857c78" letterSpacing="1.5">
            {p.label.toUpperCase()}
          </text>
        </g>
      ))}
      <line x1={pad} x2={w - pad} y1={y(50)} y2={y(50)} stroke="rgb(184 179 202 / 0.25)" strokeDasharray="3 4" />
      <text x={w - pad} y={y(50) - 5} textAnchor="end" fontSize="9.5" fill="#857c78">
        50%
      </text>
      <path d={area} fill="url(#len-fill)" />
      <path d={line} fill="none" stroke={BLUSH} strokeWidth="2.2" pathLength={1} className="draw-in" style={{ filter: "drop-shadow(0 0 6px rgb(229 184 168 / 0.6))" }} />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={x(i)} cy={y(p.winRate)} r="3.5" fill="#1b1a16" stroke={BLUSH} strokeWidth="1.5" />
          <text x={x(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="#857c78">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function LevelStrip({ levels }: { levels: { level: number; delta: number }[] }) {
  const max = Math.max(...levels.map((l) => Math.abs(l.delta)));
  return (
    <div className="flex h-56 items-center gap-1.5">
      {levels.map((l) => {
        const height = (Math.abs(l.delta) / max) * 45;
        const up = l.delta >= 0;
        return (
          <div key={l.level} className="group relative flex h-full flex-1 flex-col items-center">
            <div className="flex h-1/2 w-full items-end">
              {up && (
                <div className="w-full rounded-t-md bg-gradient-to-t from-lavender-300/30 to-lavender-300" style={{ height: `${height * 2}%` }} />
              )}
            </div>
            <div className="h-px w-full bg-lavender-300/20" />
            <div className="flex h-1/2 w-full items-start">
              {!up && <div className="w-full rounded-b-md bg-gradient-to-b from-blush-400/30 to-blush-400" style={{ height: `${height * 2}%` }} />}
            </div>
            <span className={`absolute -bottom-5 text-[0.62rem] tabular-nums ${[2, 6, 11, 16].includes(l.level) ? "text-blush-300" : "text-ink-faint"}`}>
              {l.level}
            </span>
            <span className="pointer-events-none absolute -top-6 rounded bg-night-800 px-1.5 py-0.5 text-[0.62rem] tabular-nums text-ink opacity-0 transition-opacity group-hover:opacity-100">
              {l.delta >= 0 ? "+" : ""}
              {l.delta.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BuildQuest({ path }: { path: { step: string; winRate: number; games: number }[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-6">
      {path.map((node, i) => (
        <li key={node.step} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="mx-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-blush-400/40 to-blush-400 shadow-[0_0_8px_rgb(229_184_168/0.8)]" />}
          <div className="choice min-w-36 p-4">
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">Quest {i + 1}</p>
            <p className="mt-1 text-sm text-ink">{node.step}</p>
            <p className="mt-2 text-xl tabular-nums" style={{ color: tone(node.winRate) }}>
              {pct(node.winRate)}
            </p>
            <p className="text-[0.65rem] tabular-nums text-ink-faint">{node.games.toLocaleString("en")} games</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
