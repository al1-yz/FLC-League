import type { SectionView } from "@/content";

/**
 * Architectural-sheet diagrams for the Matchup page (D16.4): original line drawings whose labels
 * and leader lines carry the Matchup's own Sections. Decorative geometry, informative labels.
 */

const LINE = "rgb(242 238 234 / 0.55)";
const FAINT = "rgb(242 238 234 / 0.18)";
const ACCENT = "#E5B8A8";

const count = (sections: SectionView[]) => sections.reduce((n, s) => n + s.insights.length, 0);

/** An exploded stack of three lane "floors" — early, mid, late — with a deck of power spikes on top. */
export function PhaseStack({ phases }: { phases: { id: string; label: string; sections: SectionView[] }[] }) {
  const plate = (cx: number, cy: number) => `M ${cx} ${cy - 46} L ${cx + 150} ${cy} L ${cx} ${cy + 46} L ${cx - 150} ${cy} Z`;
  const ys = [70, 170, 270, 370];
  const cx = 300;
  return (
    <svg viewBox="0 0 600 440" className="w-full" role="img" aria-label="Game phases as an exploded stack">
      {ys.slice(0, -1).map((y, i) =>
        [-150, 150].map((dx) => (
          <line key={`${i}${dx}`} x1={cx + dx} y1={y} x2={cx + dx} y2={ys[i + 1]} stroke={FAINT} strokeDasharray="3 5" />
        )),
      )}
      {phases.map((phase, i) => {
        const y = ys[i];
        const filled = count(phase.sections) > 0;
        const left = i % 2 === 1;
        const lx = left ? 40 : 560;
        return (
          <g key={phase.id}>
            <path d={plate(cx, y)} fill={filled ? "rgb(229 184 168 / 0.06)" : "rgb(19 18 16 / 0.4)"} stroke={LINE} strokeWidth="1" pathLength={1} className="draw-in" style={{ animationDelay: `${0.2 + i * 0.25}s` }} />
            <path d={`M ${cx - 75} ${y - 23} L ${cx + 75} ${y + 23} M ${cx + 75} ${y - 23} L ${cx - 75} ${y + 23}`} stroke={FAINT} />
            <circle cx={cx} cy={y} r="3" fill={filled ? ACCENT : "none"} stroke={ACCENT} />
            <polyline points={`${cx + (left ? -90 : 90)},${y - 14} ${left ? 130 : 470},${y - 30} ${lx},${y - 30}`} fill="none" stroke={LINE} strokeWidth="0.8" />
            <a href={`#${phase.id}`}>
              <text x={lx} y={y - 38} textAnchor={left ? "start" : "end"} fontSize="11" letterSpacing="2.4" fill="#f2eeea">
                {phase.label.toUpperCase()}
              </text>
              <text x={lx} y={y - 16} textAnchor={left ? "start" : "end"} fontSize="10" fill={filled ? ACCENT : "#857c78"}>
                {filled ? `${count(phase.sections)} coach note${count(phase.sections) > 1 ? "s" : ""}` : "awaiting coach notes"}
              </text>
            </a>
          </g>
        );
      })}
    </svg>
  );
}

/** A circular detail vignette, like an architect's enlarged detail callout. */
export function DetailCircle({ id, label, sections, motif }: { id: string; label: string; sections: SectionView[]; motif: "trade" | "window" | "build" }) {
  const n = count(sections);
  return (
    <a href={`#${id}`} className="group flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="size-28 shrink-0" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="rgb(19 18 16 / 0.5)" stroke={LINE} />
        <circle cx="60" cy="60" r="56" fill="none" stroke={ACCENT} strokeOpacity={n ? 0.8 : 0} pathLength={1} className="draw-in" />
        {motif === "trade" && <path d="M25 70 L48 45 L60 62 L72 40 L95 66" fill="none" stroke={LINE} />}
        {motif === "trade" && <path d="M25 80 H95" stroke={FAINT} />}
        {motif === "window" && <path d="M34 34 H86 V86 H34 Z M60 34 V86 M34 60 H86" fill="none" stroke={LINE} />}
        {motif === "window" && <circle cx="73" cy="47" r="6" fill={n ? ACCENT : "none"} stroke={ACCENT} />}
        {motif === "build" && <path d="M30 80 L45 40 L60 80 L75 40 L90 80 M38 60 H82" fill="none" stroke={LINE} />}
      </svg>
      <span>
        <span className="block text-[0.78rem] uppercase tracking-[0.3em] text-ink transition-colors group-hover:text-blush-300">{label}</span>
        <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.2em] text-ink-faint">
          {sections.map((s) => s.title).join(" · ")}
        </span>
        <span className={`mt-1 block text-xs ${n ? "text-blush-400" : "text-ink-faint"}`}>{n ? `${n} coach note${n > 1 ? "s" : ""}` : "awaiting coach notes"}</span>
      </span>
    </a>
  );
}

/** The lane "section": levels 1–18 as a measured elevation with phase bands and a scale bar. */
export function LaneSection() {
  const x = (level: number) => 40 + ((level - 1) / 17) * 920;
  const phases = [
    { label: "Early game", from: 1, to: 6 },
    { label: "Mid game", from: 6, to: 13 },
    { label: "Late game", from: 13, to: 18 },
  ];
  return (
    <svg viewBox="0 0 1000 120" className="w-full" role="img" aria-label="Lane section by champion level">
      <path d="M 40 70 C 200 58, 340 80, 500 62 S 820 50, 960 66" fill="none" stroke={LINE} pathLength={1} className="draw-in" />
      {phases.map((p, i) => (
        <g key={p.label}>
          <line x1={x(p.from)} x2={x(p.from)} y1="30" y2="90" stroke={FAINT} strokeDasharray="2 4" />
          <text x={(x(p.from) + x(p.to)) / 2} y="26" textAnchor="middle" fontSize="10" letterSpacing="2.4" fill={i === 0 ? ACCENT : "#bdb5b0"}>
            {p.label.toUpperCase()}
          </text>
        </g>
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i}>
          <line x1={x(i + 1)} x2={x(i + 1)} y1="94" y2={[6, 11, 16].includes(i + 1) ? 106 : 100} stroke={LINE} />
          <text x={x(i + 1)} y="118" textAnchor="middle" fontSize="9" fill={[6, 11, 16].includes(i + 1) ? ACCENT : "#857c78"}>
            {i + 1}
          </text>
        </g>
      ))}
      <line x1="40" x2="960" y1="94" y2="94" stroke={LINE} />
      {[6, 11, 16].map((level) => (
        <g key={level}>
          <line x1={x(level)} x2={x(level)} y1="40" y2="94" stroke={ACCENT} strokeOpacity="0.5" />
          <circle cx={x(level)} cy="40" r="3" fill={ACCENT} className="pulse-soft" />
        </g>
      ))}
    </svg>
  );
}
