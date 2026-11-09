/** Ambient, decorative background: drifting light, a panning art-deco pattern and grain. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow backdrop__glow--gold" />
      <div className="backdrop__glow backdrop__glow--violet" />
      <div className="backdrop__pattern" />
      <div className="backdrop__grain" />
    </div>
  );
}
