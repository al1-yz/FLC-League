/**
 * Bundles of curves streaming from the side panels into the central orb,
 * with light flowing along them. Purely decorative.
 */
const STRANDS = 16;

function strand(i: number, side: "left" | "right") {
  const spread = 30 + (i * 340) / (STRANDS - 1); // y at the panel edge
  const end = 200 + (i - STRANDS / 2) * 3; // converge near the orb's centre
  return side === "left"
    ? `M0 ${spread} C 200 ${spread}, 300 ${end}, 440 ${end}`
    : `M1000 ${spread} C 800 ${spread}, 700 ${end}, 560 ${end}`;
}

export function FlowLines() {
  return (
    <svg className="flow-lines" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="flow-left" x1="0" x2="1">
          <stop offset="0" stopColor="#B9A38B" stopOpacity="0.15" />
          <stop offset="1" stopColor="#dccbb6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="flow-right" x1="1" x2="0">
          <stop offset="0" stopColor="#9b7bd0" stopOpacity="0.15" />
          <stop offset="1" stopColor="#c9b3f2" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {(["left", "right"] as const).map((side) =>
        Array.from({ length: STRANDS }, (_, i) => (
          <g key={`${side}-${i}`}>
            <path d={strand(i, side)} stroke={`url(#flow-${side})`} strokeWidth="0.6" fill="none" opacity="0.45" />
            <path
              d={strand(i, side)}
              className="flow-lines__pulse"
              pathLength={100}
              stroke={`url(#flow-${side})`}
              strokeWidth="1.4"
              fill="none"
              style={{ animationDelay: `${(i * 0.37) % 4}s`, animationDuration: `${3.5 + (i % 5) * 0.6}s` }}
            />
          </g>
        )),
      )}
    </svg>
  );
}
