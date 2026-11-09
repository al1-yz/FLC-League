import type { ChampionView, InsightView, MatchupView, SectionView } from "@/content";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { ChampionBackdrop } from "@/ui/ChampionBackdrop";
import { FlowLines } from "@/ui/FlowLines";
import { ParticleWave } from "@/ui/ParticleWave";
import { SectionBlock } from "@/ui/SectionBlock";

export const dynamic = "force-dynamic";

const GROUP_NOTES: Record<string, string> = {
  overview: "The shape of the lane at a glance.",
  timeline: "When each champion is strong, and when that changes.",
  trading: "How short exchanges are won and lost.",
  windows: "Moments to commit — and moments to respect.",
  build: "Runes, spells and items that bend the matchup.",
  "general-concepts": "League fundamentals, applied to this lane. Each also has its own General Concept page.",
  statistics: "Numbers with their sample sizes. Own statistics arrive with feature 002.",
};

export default async function MatchupPage({
  params,
  searchParams,
}: {
  params: Promise<{ lane: string; pair: string }>;
  searchParams: Promise<{ as?: string }>;
}) {
  const { lane, pair } = await params;
  const { as } = await searchParams;
  const { kb } = loadKnowledgeBase(contentDir());
  const view = kb.matchup(`${lane}/${pair}`, as ?? pair.split("--")[0]);
  const [you, opponent] = view.champions;

  const sections = view.groups.flatMap((g) => g.sections);
  const insights = sections.flatMap((s) => s.insights);
  const about = (id: string) => insights.filter((i) => i.about === id || i.about === "both").length;
  const section = (id: string) => sections.find((s) => s.id === id);
  const timeline = view.groups.find((g) => g.id === "timeline")!;
  const detailGroups = view.groups.filter((g) => g.id !== "timeline");

  return (
    <div className="-mx-10 -mt-12">
      <ChampionBackdrop splash={you.splash} label={you.skin} />

      {/* Hero: you ⟶ matchup ⟵ opponent */}
      <header className="reveal relative px-10 pt-12">
        <p className="eyebrow">{view.lane === "mid" ? "Mid lane" : "Bot lane"} · Matchup</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight md:text-6xl">
          <span className="shimmer">{you.name}</span>{" "}
          <span className="align-middle font-display text-2xl italic text-gold-500">vs</span>{" "}
          <span className="shimmer">{opponent.name}</span>
        </h1>

        <div className="relative mt-10 grid items-center gap-6 lg:grid-cols-[17rem_minmax(0,1fr)_17rem]">
          <ChampionPanel
            champion={you}
            role="You"
            tone="gold"
            metrics={[
              { label: "Insights about you", value: about(you.id) },
              { label: "Sections covered", value: `${sections.filter((s) => s.insights.length).length} / ${sections.length}` },
              { label: "Your verdict", value: "—", hint: "Record after your next game" },
              { label: "Current patch", value: latestPatch(insights) ?? "—" },
            ]}
          />
          <div className="relative hidden h-[25rem] lg:block">
            <FlowLines />
            <Orb you={you} opponent={opponent} lane={view.lane} />
          </div>
          <ChampionPanel
            champion={opponent}
            role="Opponent"
            tone="violet"
            metrics={[
              { label: "Insights about them", value: about(opponent.id) },
              { label: "Archetype", value: "—", hint: "Not classified yet" },
              { label: "Statistical difficulty", value: "n/a", hint: "Arrives with feature 002" },
              { label: "Conflicts", value: 0 },
            ]}
          />
        </div>
      </header>

      {/* Game timeline over the particle wave */}
      <section aria-labelledby="timeline" className="relative mt-6">
        <h2 id="timeline" className="sr-only">
          {timeline.title}
        </h2>
        <div className="relative h-64">
          <ParticleWave className="absolute inset-0 h-full w-full" />
          <ol className="relative mx-auto flex h-full max-w-5xl items-start justify-between px-10 pt-8">
            {timeline.sections.map((s, i) => (
              <li key={s.id} className="reveal flex flex-col items-center" style={{ "--i": i + 4 } as React.CSSProperties}>
                <a href={`#${s.id}`} className="group flex flex-col items-center gap-3">
                  <span className="eyebrow transition-colors group-hover:text-gold-200">{s.title}</span>
                  <span className={`timeline-node ${s.insights.length ? "timeline-node--filled" : ""}`} />
                  <span className="text-xs tabular-nums text-ink-muted">
                    {s.insights.length ? `${s.insights.length} insight${s.insights.length > 1 ? "s" : ""}` : "no insights yet"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Details */}
      <div className="grid gap-6 px-10 pb-16 xl:grid-cols-2">
        <GroupPanel title="Timeline details" note={GROUP_NOTES.timeline} sections={timeline.sections} index={0} />
        {detailGroups.map((group, index) => (
          <GroupPanel
            key={group.id}
            title={group.title}
            note={GROUP_NOTES[group.id]}
            sections={group.sections}
            index={index + 1}
            emphasis={group.id === "general-concepts"}
          />
        ))}
      </div>
    </div>
  );
}

function latestPatch(insights: InsightView[]): string | undefined {
  return insights.map((i) => i.patch).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
}

function ChampionPanel({
  champion,
  role,
  tone,
  metrics,
}: {
  champion: ChampionView;
  role: string;
  tone: "gold" | "violet";
  metrics: { label: string; value: string | number; hint?: string }[];
}) {
  const accent = tone === "gold" ? "text-gold-300" : "text-[#c9b3f2]";
  return (
    <aside className={`panel reveal p-6 ${tone === "violet" ? "panel--violet" : ""}`} style={{ "--i": 2 } as React.CSSProperties}>
      <div className="flex items-center gap-3">
        {champion.icon ? (
          // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
          <img src={champion.icon} alt="" className="size-11 rounded-full ring-1 ring-gold-500/50" />
        ) : (
          <span className="size-11 rounded-full ring-1 ring-gold-500/40" />
        )}
        <div>
          <p className="eyebrow !text-[0.62rem]">{role}</p>
          <p className={`font-display text-xl ${accent}`}>{champion.name}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">{m.label}</dt>
            <dd className={`mt-1 font-display text-2xl tabular-nums ${accent}`}>{m.value}</dd>
            {m.hint && <dd className="text-[0.7rem] text-ink-faint">{m.hint}</dd>}
          </div>
        ))}
      </dl>
    </aside>
  );
}

function Orb({ you, opponent, lane }: { you: ChampionView; opponent: ChampionView; lane: MatchupView["lane"] }) {
  return (
    <div className="orb" aria-hidden="true">
      <div className="orb__halo" />
      <div className="orb__core">
        <span className="eyebrow !text-[0.6rem]">{lane === "mid" ? "Mid" : "Bot"}</span>
        <span className="font-display text-lg leading-tight text-ink">{you.name}</span>
        <span className="font-display text-xs italic text-gold-500">versus</span>
        <span className="font-display text-lg leading-tight text-ink">{opponent.name}</span>
      </div>
    </div>
  );
}

function GroupPanel({
  title,
  note,
  sections,
  index,
  emphasis = false,
}: {
  title: string;
  note?: string;
  sections: SectionView[];
  index: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`panel reveal p-7 ${emphasis ? "panel--violet xl:col-span-2" : ""}`}
      style={{ "--i": index + 6 } as React.CSSProperties}
    >
      <h2 className="eyebrow !text-[0.72rem]">{title}</h2>
      {note && <p className="mt-2 font-display text-base italic text-ink-muted">{note}</p>}
      <div className={`mt-6 grid gap-7 ${emphasis ? "md:grid-cols-2" : ""}`}>
        {sections.map((s) => (
          <SectionBlock key={s.id} section={s} />
        ))}
      </div>
    </div>
  );
}
