import { Snowfall } from "./Snowfall";

/**
 * An original, procedurally generated misty fjord: layered snowy ridges fading into fog,
 * still water with a faint reflection, drifting mist and falling snow. Decorative only.
 */
function ridge(seed: number, base: number, amplitude: number, roughness: number): string {
  let h = seed * 9301 + 49297;
  const rand = () => ((h = (h * 9301 + 49297) % 233280) / 233280);
  const points: string[] = [];
  let y = base;
  for (let x = -20; x <= 1620; x += 40) {
    y += (rand() - 0.5) * roughness;
    y = Math.min(base + amplitude * 0.4, Math.max(base - amplitude, y));
    // Occasional sharp peaks, like a fjord's walls.
    const peak = rand() > 0.82 ? -amplitude * (0.35 + rand() * 0.4) : 0;
    points.push(`${x},${(y + peak).toFixed(1)}`);
  }
  return `M-20,900 L${points.join(" L")} L1620,900 Z`;
}

const LAYERS = [
  { seed: 3, base: 380, amplitude: 170, roughness: 60, fill: "#4a4752", opacity: 0.3, blur: 6 },
  { seed: 7, base: 440, amplitude: 150, roughness: 70, fill: "#3a3740", opacity: 0.5, blur: 4 },
  { seed: 11, base: 500, amplitude: 120, roughness: 80, fill: "#2a2826", opacity: 0.8, blur: 2 },
  { seed: 17, base: 560, amplitude: 90, roughness: 90, fill: "#1c1b18", opacity: 0.95, blur: 0 },
];

export function FjordScene() {
  return (
    <div className="fjord" aria-hidden="true">
      <div className="fjord__sky" />
      <svg className="fjord__mountains" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="snowcap" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e9e4ef" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#e9e4ef" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3a3740" stopOpacity="0.9" />
            <stop offset="1" stopColor="#131210" />
          </linearGradient>
          {LAYERS.map((l) => (
            <filter key={l.seed} id={`soft-${l.seed}`}>
              <feGaussianBlur stdDeviation={l.blur} />
            </filter>
          ))}
        </defs>
        {LAYERS.map((l) => (
          <g key={l.seed} opacity={l.opacity} filter={l.blur ? `url(#soft-${l.seed})` : undefined}>
            <path d={ridge(l.seed, l.base, l.amplitude, l.roughness)} fill={l.fill} />
            <path d={ridge(l.seed, l.base, l.amplitude, l.roughness)} fill="url(#snowcap)" />
          </g>
        ))}
        <rect x="0" y="640" width="1600" height="260" fill="url(#water)" />
        <g opacity="0.12" transform="translate(0 1280) scale(1 -1)">
          <path d={ridge(17, 560, 90, 90)} fill="#b8b3ca" />
        </g>
        <line x1="0" x2="1600" y1="640" y2="640" stroke="#e5b8a8" strokeOpacity="0.25" />
      </svg>
      <div className="fjord__mist fjord__mist--a" />
      <div className="fjord__mist fjord__mist--b" />
      <Snowfall />
      <div className="fjord__veil" />
    </div>
  );
}
