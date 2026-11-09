import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";
import { Ornament } from "@/ui/Ornament";

export const dynamic = "force-dynamic";

const LANES: { id: Lane; name: string; tagline: string }[] = [
  { id: "mid", name: "Mid lane", tagline: "Tempo, priority and the art of the all-in." },
  { id: "bot", name: "Bot lane", tagline: "Spacing, spikes and the long game." },
];

export default function Home() {
  const { kb } = loadKnowledgeBase(contentDir());

  return (
    <div className="mx-auto max-w-5xl">
      <header className="reveal pt-10 pb-14 text-center">
        <p className="eyebrow mb-6">A personal study of lane matchups</p>
        <h1 className="font-display text-6xl font-medium tracking-tight md:text-7xl">
          <span className="shimmer">LoLMechs</span>
        </h1>
        <Ornament className="mx-auto mt-8 h-4 w-96 max-w-full" />
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
          What happens in a matchup, why it happens, and how to answer it — credited to the coaches who
          said it, measured against the data, judged by you.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {LANES.map((lane, index) => (
          <section
            key={lane.id}
            className="panel panel--interactive reveal p-8"
            style={{ "--i": index + 3 } as React.CSSProperties}
          >
            <p className="eyebrow">{lane.name}</p>
            <p className="mt-3 font-display text-xl italic text-gold-200">{lane.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {kb.focusChampions(lane.id).map((champion) => (
                <li key={champion.id} className="chip !text-sm !px-3 !py-1">
                  {champion.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
