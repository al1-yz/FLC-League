import Link from "next/link";
import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";
import { FjordScene } from "@/ui/FjordScene";

export const dynamic = "force-dynamic";

const LANES: { id: Lane; name: string; line: string }[] = [
  { id: "mid", name: "Mid lane", line: "Tempo, priority and the art of the all-in." },
  { id: "bot", name: "Bot lane", line: "Spacing, spikes and the long game." },
];

export default function Landing() {
  const { kb } = loadKnowledgeBase(contentDir());

  return (
    <div className="relative -mt-[4.5rem] min-h-screen overflow-hidden">
      <FjordScene />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-10 pt-36 pb-16">
        <div className="reveal">
          <h1 className="text-[clamp(5rem,16vw,13rem)] font-extralight leading-none tracking-[0.18em] text-ink/90">FLC</h1>
          <p className="mt-4 text-sm tracking-[0.3em] text-ink-muted uppercase">Focus · Learn · Climb</p>
          <p className="mt-1 text-sm font-light text-ink-faint">Full Lane Control — a personal study of lane matchups</p>
        </div>

        <ol className="mt-24 grid gap-10 md:grid-cols-2">
          {LANES.map((lane, i) => (
            <li key={lane.id} className="reveal max-w-sm" style={{ "--i": i + 3 } as React.CSSProperties}>
              <p className="flex items-baseline gap-4">
                <span className="text-2xl font-extralight text-blush-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-2xl font-light uppercase tracking-[0.12em] text-ink">{lane.name}</span>
              </p>
              <p className="mt-2 pl-12 text-sm text-ink-muted">{lane.line}</p>
              <ul className="mt-4 flex flex-wrap gap-2 pl-12">
                {kb.focusChampions(lane.id).map((c) => (
                  <li key={c.id}>
                    <Link href={`/${lane.id}/${c.id}`} className="glass-pill">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
