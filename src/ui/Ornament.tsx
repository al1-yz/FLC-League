/** Gold hairline with a central diamond; draws itself in on load. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ornament ${className}`}
      viewBox="0 0 320 16"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M0 8H146M174 8H320" stroke="url(#ornament-fade)" strokeWidth="1" />
      <rect x="155" y="3" width="10" height="10" stroke="#B9A38B" strokeWidth="1" />
      <defs>
        <linearGradient id="ornament-fade" x1="0" x2="320" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B9A38B" stopOpacity="0" />
          <stop offset="0.45" stopColor="#B9A38B" />
          <stop offset="0.55" stopColor="#B9A38B" />
          <stop offset="1" stopColor="#B9A38B" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
