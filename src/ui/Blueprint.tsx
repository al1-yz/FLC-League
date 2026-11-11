import type { SectionView } from "@/content";

/**
 * Flowing line diagrams for the Matchup page (D16.4, D17.3): original geometry whose labels carry
 * the Matchup's own Sections. Plates float, light travels along curved paths, lines breathe.
 */

const LINE = "rgb(242 238 234 / 0.5)";
const FAINT = "rgb(242 238 234 / 0.14)";
const ACCENT = "#E5B8A8";
const COOL = "#B8B3CA";

const count = (sections: SectionView[]) => sections.reduce((n, s) => n + s.insights.length, 0);
const notesLabel = (n: number) => (n ? `${n} coach note${n > 1 ? "s" : ""}` : "awaiting coach notes");

/** Four floating plates — power spikes, early, mid, late — joined by a flowing current of light. */
export function PhaseStack({ phases }: { phases: { id: string; label: string; sections: SectionView[] }[] }) {
  const cx = 300;
  const ys = [70, 175, 280, 385];
  const plate = (cy: number) => `M ${cx} ${cy - 40} L ${cx + 140} ${cy} L ${cx} ${cy + 40} L ${cx - 140} ${cy} Z`;
  // One current that weaves through every plate, top to bottom.
  const current = `M ${cx} 20 C ${cx + 120} 60, ${cx - 120} 120, ${cx} ${ys[1]} S ${cx + 130} 240, ${cx} ${ys[2]} S ${cx - 130} 340, ${cx} ${ys[3]} S ${cx + 60} 440, ${cx} 450`;
  return (
    <svg viewBox="0 0 600 460" className="w-full overflow-visible" role="img" aria-label="Game phases as a flowing stack">
      <defs>
        <linearGradient id="current" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={COOL} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <path d={current} fill="none" stroke="url(#current)" strokeOpacity="0.5" strokeWidth="1" pathLength={1} className="draw-in" />
      {[0, 1.6, 3.2].map((delay) => (
        <circle key={delay} r="3" fill={ACCENT} filter="url(#glow)">
          <animateMotion dur="7s" begin={`${delay}s`} repeatCount="indefinite" path={current} />
        </circle>
      ))}
      {phases.map((phase, i) => {
        const y = ys[i];
        const n = count(phase.sections);
        const left = i % 2 === 1;
        const lx = left ? 30 : 570;
        const leader = left
          ? `M ${cx - 110} ${y - 8} C ${cx - 170} ${y - 40}, 160 ${y - 34}, ${lx + 80} ${y - 34}`
          : `M ${cx + 110} ${y - 8} C ${cx + 170} ${y - 40}, 440 ${y - 34}, ${lx - 80} ${y - 34}`;
        return (
          <g key={phase.id} className="float" style={{ animationDelay: `${i * -1.7}s` }}>
            <path d={plate(y)} fill={n ? "rgb(229 184 168 / 0.07)" : "rgb(242 238 234 / 0.02)"} stroke={LINE} strokeWidth="0.8" />
            <path d={plate(y + 6)} fill="none" stroke={FAINT} strokeWidth="0.6" />
            <ellipse cx={cx} cy={y} rx="22" ry="7" fill="none" stroke={n ? ACCENT : FAINT} className={n ? "pulse-soft" : ""} />
            <path d={leader} fill="none" stroke={FAINT} strokeWidth="0.8" />
            <a href={`#${phase.id}`}>
              <text x={lx} y={y - 40} textAnchor={left ? "start" : "end"} fontSize="14.3" letterSpacing="3" fill="#f2eeea">
                {phase.label.toUpperCase()}
              </text>
              <text x={lx} y={y - 22} textAnchor={left ? "start" : "end"} fontSize="13" fill={n ? ACCENT : "#a69d97"}>
                {notesLabel(n)}
              </text>
            </a>
          </g>
        );
      })}
    </svg>
  );
}

/** A breathing circular callout with a slowly turning orbit. */
export function DetailCircle({ id, label, sections, motif }: { id: string; label: string; sections: SectionView[]; motif: "trade" | "window" | "build" }) {
  const n = count(sections);
  return (
    <a href={`#${id}`} className="group flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="size-28 shrink-0 overflow-visible" aria-hidden="true">
        <circle cx="60" cy="60" r="44" fill="rgb(242 238 234 / 0.03)" stroke={FAINT} />
        <circle cx="60" cy="60" r="54" fill="none" stroke={n ? ACCENT : COOL} strokeOpacity="0.45" strokeDasharray="2 7" className="orbit" />
        <circle cx="60" cy="60" r="44" fill="none" stroke={ACCENT} strokeOpacity="0.2" className="breathe-ring" />
        {motif === "trade" && <path d="M30 68 C 42 40, 52 78, 60 56 S 80 40, 90 62" fill="none" stroke={LINE} />}
        {motif === "window" && <path d="M40 40 H80 V80 H40 Z M60 40 V80 M40 60 H80" fill="none" stroke={LINE} strokeWidth="0.8" />}
        {motif === "build" && <path d="M38 78 C 46 50, 52 50, 60 40 C 68 50, 74 50, 82 78 M44 64 H76" fill="none" stroke={LINE} />}
      </svg>
      <span>
        <span className="block text-[0.9rem] uppercase tracking-[0.3em] text-ink transition-colors group-hover:text-blush-300">{label}</span>
        <span className="mt-1 block text-[0.85rem] text-ink-faint">{sections.map((s) => s.title).join(" · ")}</span>
        <span className={`mt-1 block text-xs ${n ? "text-blush-400" : "text-ink-faint"}`}>{notesLabel(n)}</span>
      </span>
    </a>
  );
}

/** The lane over levels 1–18 as a slowly undulating line with Early / Mid / Late bands. */
export function LaneSection() {
  const x = (level: number) => 40 + ((level - 1) / 17) * 920;
  const waves = [
    "M 40 70 C 200 50, 340 86, 500 62 S 820 44, 960 66",
    "M 40 64 C 200 82, 340 52, 500 70 S 820 78, 960 58",
    "M 40 70 C 200 50, 340 86, 500 62 S 820 44, 960 66",
  ];
  const phases = [
    { label: "Early game", from: 1, to: 6 },
    { label: "Mid game", from: 6, to: 13 },
    { label: "Late game", from: 13, to: 18 },
  ];
  return (
    <svg viewBox="0 0 1000 124" className="w-full overflow-visible" role="img" aria-label="Lane section by champion level">
      <defs>
        <linearGradient id="lane" x1="0" x2="1">
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={COOL} />
        </linearGradient>
      </defs>
      <path d={waves[0]} fill="none" stroke="url(#lane)" strokeWidth="1.4">
        <animate attributeName="d" dur="12s" repeatCount="indefinite" values={waves.join(";")} calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </path>
      <path d={waves[1]} fill="none" stroke={FAINT}>
        <animate attributeName="d" dur="15s" repeatCount="indefinite" values={[waves[1], waves[0], waves[1]].join(";")} calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </path>
      {phases.map((p, i) => (
        <text key={p.label} x={(x(p.from) + x(p.to)) / 2} y="22" textAnchor="middle" fontSize="13" letterSpacing="3" fill={i === 0 ? ACCENT : "#bdb5b0"}>
          {p.label.toUpperCase()}
        </text>
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <text key={i} x={x(i + 1)} y="118" textAnchor="middle" fontSize="11.7" fill={[6, 11, 16].includes(i + 1) ? ACCENT : "#a69d97"}>
          {i + 1}
        </text>
      ))}
      {[6, 11, 16].map((level) => (
        <circle key={level} cx={x(level)} cy="96" r="2.5" fill={ACCENT} className="pulse-soft" />
      ))}
    </svg>
  );
}
