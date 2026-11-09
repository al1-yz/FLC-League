import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { InsightCard } from "@/ui/InsightCard";
import { Ornament } from "@/ui/Ornament";

export const dynamic = "force-dynamic";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

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

  const insightCount = view.sections.reduce((n, s) => n + s.insights.length, 0);
  const covered = view.sections.filter((s) => s.insights.length > 0).length;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 xl:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="min-w-0">
        <header className="reveal mb-12">
          <p className="eyebrow mb-4">{view.lane === "mid" ? "Mid lane" : "Bot lane"} · Matchup</p>
          <h1 className="font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
            <span className="shimmer">{you.name}</span>{" "}
            <span className="mx-4 align-middle font-display text-2xl italic text-gold-500">vs</span>{" "}
            <span className="shimmer">{opponent.name}</span>
          </h1>
          <Ornament className="mt-6 h-4 w-80 max-w-full" />
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            <Stat label="Insights" value={insightCount} />
            <Stat label="Sections covered" value={`${covered} / ${view.sections.length}`} />
            <Stat label="Perspective" value={you.name} />
          </dl>
        </header>

        <div className="space-y-12">
          {view.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="reveal scroll-mt-12"
              style={{ "--i": index + 2 } as React.CSSProperties}
            >
              <div className="mb-4 flex items-baseline gap-4 border-b border-gold-500/10 pb-3">
                <span aria-hidden="true" className="w-8 font-display text-sm italic text-gold-600">
                  {NUMERALS[index]}
                </span>
                <h2 className="font-display text-2xl font-normal text-gold-200">{section.title}</h2>
                <span className="ml-auto text-xs text-ink-faint">
                  {section.insights.length > 0 ? `${section.insights.length} insight${section.insights.length > 1 ? "s" : ""}` : ""}
                </span>
              </div>
              {section.insights.length > 0 ? (
                <div className="space-y-4 pl-12">
                  {section.insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              ) : (
                <p className="pl-12 text-sm italic text-ink-faint">No Source covers this yet.</p>
              )}
            </section>
          ))}
        </div>
      </div>

      <aside className="hidden xl:block" aria-label="Sections">
        <div className="sticky top-12">
          <p className="eyebrow mb-4">Contents</p>
          <ol className="space-y-1 border-l border-gold-500/15">
            {view.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`-ml-px flex items-center gap-3 border-l py-1 pl-4 text-sm transition-colors ${
                    section.insights.length > 0
                      ? "border-gold-500 text-ink hover:text-gold-200"
                      : "border-transparent text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  <span className="w-6 font-display text-xs italic text-gold-600">{NUMERALS[index]}</span>
                  <span className="truncate">{section.title}</span>
                  {section.insights.length > 0 && (
                    <span className="ml-auto text-xs tabular-nums text-gold-500">{section.insights.length}</span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="eyebrow !text-[0.62rem] !text-ink-faint">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums text-gold-300">{value}</dd>
    </div>
  );
}
