import { existsSync } from "node:fs";
import { join } from "node:path";
import { EtherealScene } from "@/ui/EtherealScene";

export const dynamic = "force-dynamic";

/** Landing photo: drop a landscape image at public/landing/fjord.jpg (see docs/design/README). */
const LANDING_IMAGE = "/landing/fjord.jpg";

export default function Landing() {
  const image = existsSync(join(process.cwd(), "public", LANDING_IMAGE)) ? LANDING_IMAGE : undefined;

  return (
    <div className="relative -mt-[4.5rem] min-h-screen overflow-hidden">
      <EtherealScene image={image} snow />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-10 pt-40 pb-20">
        <div className="reveal">
          <h1 className="text-[clamp(5rem,15vw,12rem)] font-extralight leading-none tracking-[0.2em] text-ink/90">FLC</h1>
          <p className="mt-5 text-sm uppercase tracking-[0.42em] text-ink-muted">Focus · Learn · Climb</p>
        </div>

        <div className="reveal max-w-md" style={{ "--i": 4 } as React.CSSProperties}>
          <p className="text-2xl font-light tracking-wide text-ink">Full Lane Control</p>
          <p className="mt-2 text-sm text-ink-muted">A personal study of lane matchups.</p>
          <p className="mt-5 text-sm leading-relaxed text-ink-faint">
            What happens in a lane, why it happens, and how to answer it — gathered from the coaches who
            said it, measured against the games that prove it, and judged by you after every match.
          </p>
        </div>
      </section>
    </div>
  );
}
