import { EtherealScene } from "./EtherealScene";

/**
 * Full-page splash art of the selected champion (the skin chosen in config/skins.yaml), clear on the
 * right and dissolving into blur and mist on the left (D17.2). Falls back to the ambient backdrop.
 */
export function ChampionBackdrop({ splash, label }: { splash?: string; label?: string }) {
  if (!splash) return null;
  return (
    <>
      <EtherealScene image={splash} />
      {label && <p className="pointer-events-none fixed right-10 bottom-8 z-0 eyebrow eyebrow--cool opacity-70">{label}</p>}
    </>
  );
}
