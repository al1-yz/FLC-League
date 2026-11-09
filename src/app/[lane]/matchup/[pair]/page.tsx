import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { InsightCard } from "@/ui/InsightCard";

export const dynamic = "force-dynamic";

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

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-semibold">
        {you.name} vs {opponent.name}
      </h1>
      {view.sections.map((section) => (
        <section key={section.id} className="space-y-3">
          <h2 className="text-lg font-medium text-accent">{section.title}</h2>
          {section.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </section>
      ))}
    </div>
  );
}
