/**
 * PROTOTYPE — throwaway design study for the Matchup statistics view (D15.4, D19.1).
 * Uses invented sample data from src/prototype/sample-stats.ts. Not linked from navigation
 * except the statistics link on Matchup pages.
 */
import { loadKnowledgeBase, type ChampionView } from "@/content";
import { contentDir } from "@/content/config";
import { sampleStats, type SampleArchetype, type SampleOpponent } from "@/prototype/sample-stats";
import { EtherealScene } from "@/ui/EtherealScene";
import { Reveal } from "@/ui/Reveal";

export const dynamic = "force-dynamic";

const SAMPLE_OPPONENTS = ["syndra", "ahri", "sylas", "viktor", "azir", "leblanc", "yasuo", "yone", "akali", "zed", "annie", "xerath"];

const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
const BLUSH = "#E5B8A8";
const LAVENDER = "#B8B3CA";
const MAUVE = "#988382";
const INK_FAINT = "#a69d97";

/** Lavender when the matchup favours you, blush when it threatens you. */
const tone = (winRate: number) => (winRate >= 50 ? LAVENDER : BLUSH);

export default async function StatsPrototype({ searchParams }: { searchParams: Promise<{ champion?: string }> }) {
  const { champion = "orianna" } = await searchParams;
  const { kb } = loadKnowledgeBase(contentDir());
  const you = kb.champion(champion);
  const opponents = SAMPLE_OPPONENTS.filter((id) => id !== champion).map((id) => kb.champion(id));
  const stats = sampleStats(champion, opponents.map((o) => o.id));

  return (
    <div className="legible relative">
      <EtherealScene />

      <div className="mx-auto max-w-6xl px-10 pt-14 pb-24">
        <p className="reveal flex items-center gap-3 text-xs text-blush-300">
          <span className="pulse-soft size-2 rounded-full bg-blush-400" aria-hidden="true" />
          Prototype · sample data only. These numbers are invented to review the design — real statistics arrive with feature 002.
        </p>

        <header className="reveal mt-10" style={{ "--i": 1 } as React.CSSProperties}>
          <p className="text-[0.85rem] uppercase tracking-[0.4em] text-ink-muted">Matchup analysis · Emerald+ · Patch {kb.currentPatch()}</p>
          <h1 className="mt-4 text-6xl font-light uppercase tracking-[0.2em] text-ink md:text-7xl">
            {you.name} <span className="text-blush-400">in numbers</span>
          </h1>
        </header>

        {/* Key figures, floating */}
        <section aria-label="Key figures" className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <RingStat label="Win rate" value={stats.winRate} max={100} display={pct(stats.winRate, 2)} index={2} />
          <RingStat label="Pick rate" value={stats.pickRate} max={15} display={pct(stats.pickRate)} index={3} />
          <RingStat label="Ban rate" value={stats.banRate} max={15} display={pct(stats.banRate)} index={4} />
          <TierBadge tier={stats.tier} games={stats.games} index={5} />
        </section>

        <div className="mt-24 grid items-center gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Flow title="Influence map" subtitle="Who pulls your win rate up or down. Line weight is games played; distance is how one-sided it is.">
            <InfluenceGraph you={you} opponents={opponents} data={stats.opponents} />
          </Flow>
          <Flow title="Archetype handshake" subtitle="How you shake hands with each archetype." delay={120}>
            <Handshake archetypes={stats.archetypes} />
          </Flow>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-2">
          <Flow title="Win rate by game length" subtitle="Where the game is won: early, mid or late.">
            <GameLengthChart points={stats.byGameLength} />
          </Flow>
          <Flow title="Level spikes" subtitle="Win-rate swing relative to your average, level by level." delay={120}>
            <LevelStrip levels={stats.byLevel} />
          </Flow>
        </div>

        <div className="mt-24 grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Flow title="Damage profile" subtitle="What kind of damage you bring.">
            <DamageProfile damage={stats.damage} />
          </Flow>
          <Flow title="Phase strength" subtitle="Win rate when the game is decided in each phase." delay={120}>
            <PhaseStrength phases={stats.byPhase} />
          </Flow>
        </div>

        <div className="mt-24">
          <Flow title="Build quest" subtitle="Your item path as a quest line. Each stop: win rate and games.">
            <BuildQuest path={stats.buildPath} />
          </Flow>
        </div>
      </div>
    </div>
  );
}

function Flow({ title, subtitle, children, delay = 0 }: { title: string; subtitle: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <section>
        <h2 className="sheet__title !mb-1">{title}</h2>
        <p className="text-sm text-ink-faint">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </section>
    </Reveal>
  );
}

function RingStat({ label, value, max, display, index }: { label: string; value: number; max: number; display: string; index: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(value / max, 1);
  return (
    <div className="reveal float flex items-center gap-5" style={{ "--i": index, animationDelay: `${index * -1.3}s` } as React.CSSProperties}>
      <svg viewBox="0 0 100 100" className="size-24 -rotate-90 overflow-visible" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="none" stroke={LAVENDER} strokeOpacity="0.35" strokeDasharray="1.5 5" className="orbit" style={{ transformOrigin: "50px 50px" }} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(184 179 202 / 0.1)" strokeWidth="5" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={BLUSH}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circumference * filled} ${circumference}`}
          style={{ filter: "drop-shadow(0 0 8px rgb(229 184 168 / 0.7))" }}
        >
          <animate attributeName="stroke-dasharray" from={`0 ${circumference}`} to={`${circumference * filled} ${circumference}`} dur="1.8s" fill="freeze" calcMode="spline" keySplines="0.2 0.7 0.2 1" />
        </circle>
      </svg>
      <div>
        <p className="text-[0.9rem] uppercase tracking-[0.3em] text-ink-faint">{label}</p>
        <p className="mt-1 text-3xl font-normal tabular-nums text-ink">{display}</p>
      </div>
    </div>
  );
}

function TierBadge({ tier, games, index }: { tier: string; games: number; index: number }) {
  const xp = Math.min(games / 100_000, 1);
  return (
    <div className="reveal float" style={{ "--i": index, animationDelay: `${index * -1.3}s` } as React.CSSProperties}>
      <div className="flex items-center gap-5">
        <div className="breathe-glow grid size-20 place-items-center rounded-full border border-blush-400/50 text-4xl font-light text-blush-300">
          {tier}
        </div>
        <div>
          <p className="text-[0.9rem] uppercase tracking-[0.3em] text-ink-faint">Tier</p>
          <p className="mt-1 text-sm text-ink-muted">{games.toLocaleString("en")} games</p>
        </div>
      </div>
      <div className="mt-5 h-px bg-lavender-300/15">
        <div className="h-px bg-gradient-to-r from-blush-400 to-lavender-300 shadow-[0_0_8px_rgb(229_184_168/0.8)]" style={{ width: `${xp * 100}%` }} />
      </div>
      <p className="mt-1.5 text-[0.9rem] text-ink-faint">Sample size toward 100k games</p>
    </div>
  );
}

function InfluenceGraph({ you, opponents, data }: { you: ChampionView; opponents: ChampionView[]; data: SampleOpponent[] }) {
  const size = 460;
  const c = size / 2;
  const maxGames = Math.max(...data.map((d) => d.games));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[32rem] overflow-visible" role="img" aria-label="Influence map of opponents">
      <defs>
        <clipPath id="node-clip">
          <circle r="19" />
        </clipPath>
        <clipPath id="you-clip">
          <circle cx={c} cy={c} r="32" />
        </clipPath>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      {[80, 140, 200].map((ring, i) => (
        <circle key={ring} cx={c} cy={c} r={ring} fill="none" stroke={LAVENDER} strokeOpacity="0.08" strokeDasharray="2 6" className="orbit" style={{ transformOrigin: `${c}px ${c}px`, animationDuration: `${60 + i * 25}s` }} />
      ))}
      {data.map((d, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const distance = 100 + Math.min(Math.abs(d.winRate - 50) * 14, 100);
        const x = c + Math.cos(angle) * distance;
        const y = c + Math.sin(angle) * distance;
        // Curve the strand slightly so the map reads like currents, not spokes.
        const bend = angle + 0.35;
        const qx = c + Math.cos(bend) * distance * 0.5;
        const qy = c + Math.sin(bend) * distance * 0.5;
        const strand = `M ${c} ${c} Q ${qx} ${qy} ${x} ${y}`;
        const opponent = opponents[i];
        return (
          <g key={d.id}>
            <path d={strand} fill="none" stroke={tone(d.winRate)} strokeOpacity="0.4" strokeWidth={0.8 + (d.games / maxGames) * 4} pathLength={1} className="draw-in" />
            <circle r="2.2" fill={tone(d.winRate)} filter="url(#soft-glow)">
              <animateMotion dur={`${4 + (i % 4)}s`} begin={`${(i * 0.4) % 3}s`} repeatCount="indefinite" path={strand} />
            </circle>
            <g transform={`translate(${x} ${y})`}>
              <g className="float" style={{ animationDelay: `${i * -0.8}s` }}>
                <circle r="22" fill="#1b1a16" stroke={tone(d.winRate)} strokeWidth="1" />
                {opponent.icon ? (
                  <image href={opponent.icon} x="-19" y="-19" width="38" height="38" clipPath="url(#node-clip)" />
                ) : (
                  <text textAnchor="middle" dy="4" fontSize="14.3" fill="#f2eeea">
                    {opponent.name.slice(0, 3)}
                  </text>
                )}
                <text textAnchor="middle" y="37" fontSize="13.7" fill={tone(d.winRate)} className="tabular-nums">
                  {pct(d.winRate)}
                </text>
              </g>
            </g>
          </g>
        );
      })}
      <circle cx={c} cy={c} r="44" fill="none" stroke={BLUSH} strokeOpacity="0.3" className="breathe-ring" style={{ transformOrigin: `${c}px ${c}px` }} />
      <circle cx={c} cy={c} r="35" fill="#23211b" stroke={BLUSH} strokeWidth="1" style={{ filter: "drop-shadow(0 0 16px rgb(229 184 168 / 0.6))" }} />
      {you.icon && <image href={you.icon} x={c - 32} y={c - 32} width="64" height="64" clipPath="url(#you-clip)" />}
      <g fontSize="13" fill={INK_FAINT}>
        <circle cx="10" cy={size - 22} r="3.5" fill={LAVENDER} />
        <text x="20" y={size - 18}>favours you</text>
        <circle cx="10" cy={size - 6} r="3.5" fill={BLUSH} />
        <text x="20" y={size - 2}>threatens you</text>
      </g>
    </svg>
  );
}

function Handshake({ archetypes }: { archetypes: SampleArchetype[] }) {
  const width = 360;
  const rowHeight = 50;
  const height = archetypes.length * rowHeight;
  const total = archetypes.reduce((n, a) => n + a.games, 0);
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible" role="img" aria-label="Archetype handshake">
      <defs>
        <linearGradient id="you-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLUSH} />
          <stop offset="1" stopColor={LAVENDER} />
        </linearGradient>
      </defs>
      {archetypes.map((a, i) => {
        const band = (a.games / total) * height;
        const y0 = offset + band / 2;
        offset += band;
        const y1 = i * rowHeight + rowHeight / 2;
        const ribbon = `M 12 ${y0} C 140 ${y0}, 150 ${y1}, 222 ${y1}`;
        return (
          <g key={a.name}>
            <path d={ribbon} fill="none" stroke={tone(a.winRate)} strokeOpacity="0.18" strokeWidth={Math.max(band - 3, 2)} />
            <path d={ribbon} fill="none" stroke={tone(a.winRate)} strokeOpacity="0.8" strokeWidth="1" strokeDasharray="2 10" className="ribbon-flow" style={{ animationDuration: `${6 + i}s` }} />
            <circle cx="226" cy={y1} r="3.5" fill={tone(a.winRate)} className="pulse-soft" />
            <text x="238" y={y1 - 3} fontSize="15.6" fill="#f2eeea" letterSpacing="0.5">
              {a.name}
            </text>
            <text x="238" y={y1 + 13} fontSize="13.7" fill={tone(a.winRate)} className="tabular-nums">
              {pct(a.winRate)} · {a.games.toLocaleString("en")}
            </text>
          </g>
        );
      })}
      <rect x="6" y="0" width="5" height={height} rx="2.5" fill="url(#you-bar)" style={{ filter: "drop-shadow(0 0 8px rgb(229 184 168 / 0.6))" }} />
    </svg>
  );
}

function GameLengthChart({ points }: { points: { label: string; winRate: number }[] }) {
  const w = 480;
  const h = 230;
  const pad = 30;
  const min = 42;
  const max = 58;
  const x = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  // Smooth curve through the points (Catmull-Rom → cubic Bézier).
  const p = points.map((pt, i) => [x(i), y(pt.winRate)]);
  const line = p
    .map(([px, py], i) => {
      if (i === 0) return `M ${px} ${py}`;
      const [x0, y0] = p[i - 2] ?? p[i - 1];
      const [x1, y1] = p[i - 1];
      const [x3, y3] = p[i + 1] ?? [px, py];
      return `C ${x1 + (px - x0) / 6} ${y1 + (py - y0) / 6}, ${px - (x3 - x1) / 6} ${py - (y3 - y1) / 6}, ${px} ${py}`;
    })
    .join(" ");
  const area = `${line} L ${x(points.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;
  const phases = [
    { label: "Early", from: 0, to: 2 },
    { label: "Mid", from: 2, to: 4 },
    { label: "Late", from: 4, to: points.length - 1 },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" role="img" aria-label="Win rate by game length">
      <defs>
        <linearGradient id="len-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLUSH} stopOpacity="0.3" />
          <stop offset="1" stopColor={BLUSH} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="len-line" x1="0" x2="1">
          <stop offset="0" stopColor={BLUSH} />
          <stop offset="1" stopColor={LAVENDER} />
        </linearGradient>
      </defs>
      {phases.map((ph) => (
        <text key={ph.label} x={(x(ph.from) + x(ph.to)) / 2} y={pad - 14} textAnchor="middle" fontSize="13" fill={INK_FAINT} letterSpacing="3">
          {ph.label.toUpperCase()}
        </text>
      ))}
      <line x1={pad} x2={w - pad} y1={y(50)} y2={y(50)} stroke="rgb(184 179 202 / 0.2)" strokeDasharray="2 6" />
      <text x={w - pad} y={y(50) - 6} textAnchor="end" fontSize="12.3" fill={INK_FAINT}>
        50%
      </text>
      <path d={area} fill="url(#len-fill)" />
      <path d={line} fill="none" stroke="url(#len-line)" strokeWidth="2" pathLength={1} className="draw-in" style={{ filter: "drop-shadow(0 0 6px rgb(229 184 168 / 0.6))" }} />
      <circle r="4" fill="#fff4ef" style={{ filter: "drop-shadow(0 0 6px rgb(229 184 168 / 0.9))" }}>
        <animateMotion dur="8s" repeatCount="indefinite" path={line} />
      </circle>
      {points.map((pt, i) => (
        <text key={pt.label} x={x(i)} y={h - 8} textAnchor="middle" fontSize="13" fill={INK_FAINT}>
          {pt.label}
        </text>
      ))}
    </svg>
  );
}

function LevelStrip({ levels }: { levels: { level: number; delta: number }[] }) {
  const max = Math.max(...levels.map((l) => Math.abs(l.delta)));
  return (
    <div className="flex h-56 items-center gap-1.5">
      {levels.map((l, i) => {
        const height = (Math.abs(l.delta) / max) * 90;
        const up = l.delta >= 0;
        return (
          <div key={l.level} className="group relative flex h-full flex-1 flex-col items-center">
            <div className="flex h-1/2 w-full items-end justify-center">
              {up && <div className="grow-up w-1.5 rounded-full bg-gradient-to-t from-lavender-300/10 to-lavender-300 shadow-[0_0_10px_rgb(184_179_202/0.6)]" style={{ height: `${height}%`, animationDelay: `${i * 50}ms` }} />}
            </div>
            <div className="h-px w-full bg-lavender-300/15" />
            <div className="flex h-1/2 w-full items-start justify-center">
              {!up && <div className="grow-down w-1.5 rounded-full bg-gradient-to-b from-blush-400/10 to-blush-400 shadow-[0_0_10px_rgb(229_184_168/0.6)]" style={{ height: `${height}%`, animationDelay: `${i * 50}ms` }} />}
            </div>
            <span className={`absolute -bottom-5 text-[0.9rem] tabular-nums ${[6, 11, 16].includes(l.level) ? "text-blush-300" : "text-ink-faint"}`}>{l.level}</span>
            <span className="pointer-events-none absolute -top-6 rounded-full bg-night-800/90 px-2 py-0.5 text-[0.9rem] tabular-nums text-ink opacity-0 transition-opacity group-hover:opacity-100">
              {up ? "+" : ""}
              {l.delta.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DamageProfile({ damage }: { damage: { magic: number; physical: number; true: number } }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const parts = [
    { label: "Magic", value: damage.magic, color: LAVENDER },
    { label: "Physical", value: damage.physical, color: BLUSH },
    { label: "True", value: damage.true, color: MAUVE },
  ];
  let offset = 0;
  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 180 180" className="size-44 -rotate-90 overflow-visible" role="img" aria-label="Damage profile">
        {parts.map((part) => {
          const length = (part.value / 100) * circumference;
          const segment = (
            <circle
              key={part.label}
              cx="90"
              cy="90"
              r={r}
              fill="none"
              stroke={part.color}
              strokeWidth="10"
              strokeDasharray={`${Math.max(length - 4, 0)} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${part.color})` }}
            />
          );
          offset += length;
          return segment;
        })}
        <circle cx="90" cy="90" r="84" fill="none" stroke={LAVENDER} strokeOpacity="0.25" strokeDasharray="1.5 6" className="orbit" style={{ transformOrigin: "90px 90px" }} />
      </svg>
      <ul className="space-y-3">
        {parts.map((part) => (
          <li key={part.label} className="flex items-baseline gap-3">
            <span className="size-2 rounded-full" style={{ background: part.color, boxShadow: `0 0 8px ${part.color}` }} />
            <span className="w-20 text-[0.8rem] uppercase tracking-[0.25em] text-ink-faint">{part.label}</span>
            <span className="text-xl font-normal tabular-nums text-ink">{pct(part.value, 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseStrength({ phases }: { phases: { phase: string; winRate: number }[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {phases.map((ph, i) => {
        const height = 30 + ((ph.winRate - 44) / 12) * 70;
        return (
          <div key={ph.phase} className="flex flex-col items-center">
            <div className="relative flex h-44 w-full items-end justify-center">
              <div
                className="float w-20 rounded-t-full border border-b-0 bg-gradient-to-t from-transparent"
                style={{
                  height: `${height}%`,
                  borderColor: tone(ph.winRate),
                  ["--tw-gradient-to" as string]: `${tone(ph.winRate)}33`,
                  animationDelay: `${i * -2}s`,
                  boxShadow: `0 -10px 30px -12px ${tone(ph.winRate)}`,
                }}
              />
            </div>
            <p className="mt-3 text-[0.8rem] uppercase tracking-[0.3em] text-ink-faint">{ph.phase}</p>
            <p className="text-xl font-normal tabular-nums" style={{ color: tone(ph.winRate) }}>
              {pct(ph.winRate)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function BuildQuest({ path }: { path: { step: string; winRate: number; games: number }[] }) {
  const w = 1000;
  const h = 170;
  const xs = path.map((_, i) => 70 + (i / (path.length - 1)) * (w - 140));
  const ys = path.map((_, i) => (i % 2 ? 110 : 60));
  const trail = xs.map((x, i) => (i ? `S ${x - 60} ${ys[i]}, ${x} ${ys[i]}` : `M ${x} ${ys[i]}`)).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" role="img" aria-label="Build quest">
      <path d={trail} fill="none" stroke={BLUSH} strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2 8" className="ribbon-flow" />
      <circle r="4" fill="#fff4ef" style={{ filter: "drop-shadow(0 0 6px rgb(229 184 168 / 0.9))" }}>
        <animateMotion dur="9s" repeatCount="indefinite" path={trail} />
      </circle>
      {path.map((node, i) => (
        <g key={node.step} transform={`translate(${xs[i]} ${ys[i]})`}>
          <circle r="9" fill="#1b1a16" stroke={tone(node.winRate)} />
          <circle r="3" fill={tone(node.winRate)} className="pulse-soft" />
          <text y={i % 2 ? 34 : -42} textAnchor="middle" fontSize="12.3" fill={INK_FAINT} letterSpacing="2.5">
            {`QUEST ${i + 1}`}
          </text>
          <text y={i % 2 ? 50 : -26} textAnchor="middle" fontSize="15.6" fill="#f2eeea">
            {node.step}
          </text>
          <text y={i % 2 ? 66 : -10} textAnchor="middle" fontSize="14.3" fill={tone(node.winRate)} className="tabular-nums">
            {pct(node.winRate)} · {node.games.toLocaleString("en")}
          </text>
        </g>
      ))}
    </svg>
  );
}
