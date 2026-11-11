/** Original, minimal lane glyphs: a square map with the lane's path. */
export function LaneGlyph({ lane, className = "size-4" }: { lane: "mid" | "bot"; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" strokeOpacity="0.45" />
      {lane === "mid" ? <path d="M4 12 L12 4" /> : <path d="M4 12.5 H12.5 V4" />}
    </svg>
  );
}
