import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";

export const dynamic = "force-dynamic";

const LANES: { id: Lane; name: string; tagline: string }[] = [
  { id: "mid", name: "Mid lane", tagline: "Tempo, priority and the art of the all-in." },
  { id: "bot", name: "Bot lane", tagline: "Spacing, spikes and the long game." },
];

export default function Home() {
  const { kb } = loadKnowledgeBase(contentDir());

  return (
    <div className="mx-auto max-w-5xl">
      <header className="reveal pt-10 pb-14">
        <p className="eyebrow mb-6">A personal study of lane matchups</p>
        <h1 className="text-6xl font-medium tracking-tight md:text-7xl">LoLMechs</h1>
        <div className="mt-8 h-px w-1/3 bg-gradient-to-r from-blush-400/70 to-transparent" />
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
          What happens in a matchup, why it happens, and how to answer it — credited to the coaches who
          said it, measured against the data, judged by you.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {LANES.map((lane, index) => (
          <section key={lane.id} className="panel reveal p-8" style={{ "--i": index + 3 } as React.CSSProperties}>
            <p className="eyebrow">{lane.name}</p>
            <p className="mt-3 text-xl text-ink">{lane.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {kb.focusChampions(lane.id).map((champion) => (
                <li key={champion.id} className="chip !px-3 !py-1 !text-sm">
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
