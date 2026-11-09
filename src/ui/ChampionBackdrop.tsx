/**
 * Full-page splash art of the selected champion (the skin chosen in config/skins.yaml),
 * veiled in deep violet so data on top stays readable. Falls back to the ambient backdrop.
 */
export function ChampionBackdrop({ splash, label }: { splash?: string; label?: string }) {
  if (!splash) return null;
  return (
    <div className="champion-backdrop" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- local file, no optimisation needed */}
      <img src={splash} alt="" className="champion-backdrop__art" />
      <div className="champion-backdrop__veil" />
      {label && <p className="champion-backdrop__label eyebrow">{label}</p>}
    </div>
  );
}
