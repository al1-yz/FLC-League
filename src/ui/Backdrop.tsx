/** Ambient, decorative background: drifting warm and cool light, and grain. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow backdrop__glow--warm" />
      <div className="backdrop__glow backdrop__glow--cool" />
      <div className="backdrop__grain" />
    </div>
  );
}
