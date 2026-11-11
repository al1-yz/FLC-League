import { Snowfall } from "./Snowfall";

/**
 * Full-bleed image that is clear on the right and dissolves into blur and mist on the left
 * (D17.2, after `design-references/reference-ethereal-split.png` (private content repo)). Used by the landing and champion pages.
 * Without an image it falls back to soft drifting light only.
 */
export function EtherealScene({ image, snow = false, focus = "70% 30%" }: { image?: string; snow?: boolean; focus?: string }) {
  return (
    <div className="ethereal" aria-hidden="true">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- local file
        <img src={image} alt="" className="ethereal__image" style={{ objectPosition: focus }} />
      ) : (
        <div className="ethereal__fallback" />
      )}
      <div className="ethereal__blur" />
      <div className="ethereal__mist ethereal__mist--a" />
      <div className="ethereal__mist ethereal__mist--b" />
      {snow && <Snowfall />}
      <div className="ethereal__veil" />
    </div>
  );
}
