import Link from "next/link";
import type { ChampionView, InsightView, MatchupView, SectionView } from "@/content";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { ChampionBackdrop } from "@/ui/ChampionBackdrop";
import { FlowLines } from "@/ui/FlowLines";
import { ParticleWave } from "@/ui/ParticleWave";
import { StepFlow, type Step } from "@/ui/StepFlow";

export const dynamic = "force-dynamic";

/** The game plan: Matchup Sections presented as coached steps, in the order a game unfolds. */
const PLAN: { id: string; title: string; prompt: string; sections: string[] }[] = [
  {
    id: "step-lane",
    title: "Read the lane",
    prompt: "What kind of lane is this, and how does each side win it?",
    sections: ["overview", "difficulty", "win-conditions", "support-influence"],
  },
  { id: "step-spikes", title: "Know the spikes", prompt: "When does each champion suddenly get stronger?", sections: ["power-spikes"] },
  { id: "step-early", title: "Early game", prompt: "How do levels 1 to 5 play out?", sections: ["early-game"] },
  {
    id: "step-trading",
    title: "Trade",
    prompt: "How do you win the short exchanges?",
    sections: ["trading-patterns", "trading-stance", "cooldown-windows"],
  },
  {
    id: "step-windows",
    title: "Pick your windows",
    prompt: "When do you commit — and when do you back off?",
    sections: ["all-in-windows", "kill-windows", "defensive-windows"],
  },
  { id: "step-mid", title: "Mid game", prompt: "What changes once the lane opens up?", sections: ["mid-game"] },
  { id: "step-late", title: "Late game", prompt: "Who wins the long game, and how?", sections: ["late-game"] },
  { id: "step-build", title: "Build for it", prompt: "Which runes, spells and items bend this matchup?", sections: ["runes", "summoner-spells", "itemization"] },
];

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
  const steps: Step[] = PLAN.map((p) => ({
    ...p,
    sections: p.sections
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is SectionView => Boolean(s)),
  })).filter((s) => s.sections.length > 0);

  return (
    <div className="-mx-10 -mt-12">
      <ChampionBackdrop splash={you.splash} label={you.skin} />

      {/* Hero: you ⟶ matchup ⟵ opponent */}
      <header className="reveal relative px-10 pt-12">
        <p className="eyebrow">{view.lane === "mid" ? "Mid lane" : "Bot lane"} · Matchup</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight md:text-6xl">
          {you.name} <span className="align-middle text-2xl font-light text-blush-400">vs</span> {opponent.name}
        </h1>

        <div className="relative mt-10 grid items-center gap-6 lg:grid-cols-[17rem_minmax(0,1fr)_17rem]">
          <ChampionPanel
            champion={you}
            role="You"
            tone="warm"
            metrics={[
              { label: "Insights about you", value: about(you.id) },
              { label: "Sections covered", value: `${sections.filter((s) => s.insights.length).length} / ${sections.length}` },
              { label: "Your verdict", value: "—", hint: "Record after your next game" },
              { label: "Latest patch", value: latestPatch(insights) ?? "—" },
            ]}
          />
          <div className="relative hidden h-[25rem] lg:block">
            <FlowLines />
            <Orb you={you} opponent={opponent} lane={view.lane} />
          </div>
          <ChampionPanel
            champion={opponent}
            role="Opponent"
            tone="cool"
            metrics={[
              { label: "Insights about them", value: about(opponent.id) },
              { label: "Archetype", value: "—", hint: "Not classified yet" },
              { label: "Statistical difficulty", value: "n/a", hint: "Arrives with feature 002" },
              { label: "Conflicts", value: 0 },
            ]}
          />
        </div>
      </header>

      {/* Game-plan rail over the particle wave */}
      <nav aria-label="Game plan" className="relative mt-4">
        <div className="relative h-56">
          <ParticleWave className="absolute inset-0 h-full w-full" />
          <ol className="relative mx-auto flex h-full max-w-6xl items-start justify-between px-10 pt-10">
            {steps.map((step, i) => {
              const count = step.sections.reduce((n, s) => n + s.insights.length, 0);
              return (
                <li key={step.id} className="reveal" style={{ "--i": i + 4 } as React.CSSProperties}>
                  <a href={`#${step.id}`} className="group flex flex-col items-center gap-3 text-center">
                    <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-ink-muted transition-colors group-hover:text-blush-300">
                      {step.title}
                    </span>
                    <span className={`rail-node ${count ? "rail-node--filled" : ""}`} />
                    <span className="text-[0.65rem] tabular-nums text-ink-faint">Step {i + 1}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      {/* The game plan, step by step */}
      <section aria-label="Game plan steps" className="px-10 pb-12">
        <StepFlow steps={steps} />
      </section>

      {/* Statistics */}
      <section aria-labelledby="statistics-title" className="px-10 pb-20">
        <div className="panel mx-auto flex max-w-5xl flex-wrap items-center gap-6 p-8">
          <div className="min-w-0 flex-1">
            <p className="eyebrow eyebrow--cool">Statistics</p>
            <h2 id="statistics-title" className="mt-2 text-2xl font-normal text-ink">
              Matchup analysis
            </h2>
            <p className="mt-2 text-ink-muted">
              Own statistics from the Riot API arrive with feature 002. A design prototype of the analysis
              view, with sample data, is ready for review.
            </p>
          </div>
          <Link
            href={`/prototype/stats?lane=${view.lane}&champion=${you.id}`}
            className="rounded-xl bg-blush-400 px-5 py-3 text-sm font-medium text-night-900 transition-colors hover:bg-blush-300"
          >
            Open the prototype →
          </Link>
        </div>
      </section>
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
  tone: "warm" | "cool";
  metrics: { label: string; value: string | number; hint?: string }[];
}) {
  const accent = tone === "warm" ? "text-blush-300" : "text-lavender-200";
  return (
    <aside className="panel reveal p-6" style={{ "--i": 2 } as React.CSSProperties}>
      <div className="flex items-center gap-3">
        {champion.icon ? (
          // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
          <img src={champion.icon} alt="" className="size-11 rounded-full ring-1 ring-lavender-300/40" />
        ) : (
          <span className="size-11 rounded-full ring-1 ring-lavender-300/30" />
        )}
        <div>
          <p className={`eyebrow ${tone === "cool" ? "eyebrow--cool" : ""}`}>{role}</p>
          <p className={`text-xl font-medium ${accent}`}>{champion.name}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">{m.label}</dt>
            <dd className={`mt-1 text-2xl tabular-nums ${accent}`}>{m.value}</dd>
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
        <span className="text-lg leading-tight text-ink">{you.name}</span>
        <span className="text-xs font-light text-blush-400">versus</span>
        <span className="text-lg leading-tight text-ink">{opponent.name}</span>
      </div>
    </div>
  );
}
