import Link from "next/link";
import { notFound } from "next/navigation";
import { loadKnowledgeBase, type ArchetypeMatchupView } from "@/content";
import { contentDir } from "@/content/config";
import { EtherealScene } from "@/ui/EtherealScene";

export const dynamic = "force-dynamic";

/** One Archetype Matchup (FR-034): written principles, champions per Archetype, related Matchups. */
export default async function ArchetypeMatchupPage({ params }: { params: Promise<{ lane: string; pair: string }> }) {
  const { lane, pair } = await params;
  const { kb } = loadKnowledgeBase(contentDir());
  let view: ArchetypeMatchupView;
  try {
    view = kb.archetypeMatchup(`${lane}/${pair}`);
  } catch {
    notFound();
  }
  const [a, b] = view.archetypes;

  return (
    <div className="legible relative">
      <EtherealScene />
      <div className="mx-auto max-w-6xl px-10 pt-16 pb-24">
        <p className="text-[0.85rem] uppercase tracking-[0.4em] text-ink-muted">
          {view.lane === "mid" ? "Mid lane" : "Bot lane"} · Archetype Matchup
        </p>
        <h1 className="mt-4 text-6xl font-light uppercase tracking-[0.18em] text-ink">
          {a.name} <span className="text-blush-400">vs</span> {b.name}
        </h1>

        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <section aria-labelledby="principles-title">
            <h2 id="principles-title" className="sheet__title">Principles</h2>
            {view.insights.length ? (
              <ul className="space-y-6">
                {view.insights.map((insight) => (
                  <li key={insight.id}>
                    <article className={insight.outdated ? "opacity-70" : ""}>
                      {insight.outdated && <p className="mb-1.5"><span className="chip !text-ink-faint">Possibly outdated · {insight.patch}</span></p>}
                      <p className="leading-relaxed text-ink-muted">{insight.claim}</p>
                      <p className="mt-2 text-[0.82rem] uppercase tracking-[0.18em] text-ink-faint">
                        <a href={insight.link} target="_blank" rel="noreferrer" className="text-blush-400 hover:text-blush-300">
                          {insight.source.name}
                          {insight.locator && ` @ ${insight.locator}`}
                        </a>
                        {" · "}Patch {insight.patch} · noted {insight.noted}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-ink-faint">Awaiting coach notes.</p>
            )}
          </section>

          <div className="space-y-12">
            {view.archetypes.map((archetype) => (
              <section key={archetype.id} aria-label={archetype.name}>
                <h2 className="sheet__title">{archetype.name}</h2>
                {archetype.champions.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {archetype.champions.map((c) => (
                      <li key={c.id}>
                        <Link href={`/opponents/${c.id}`} className="glass-pill">{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-ink-faint">No champion classified here yet.</p>
                )}
              </section>
            ))}
            <section aria-labelledby="computed-title">
              <h2 id="computed-title" className="sheet__title">Computed figures</h2>
              <p className="text-sm text-ink-faint">Not yet available — they arrive with the statistics collector (feature 002).</p>
            </section>
            <section aria-labelledby="related-title">
              <h2 id="related-title" className="sheet__title">Your matchups between them</h2>
              {view.matchups.length ? (
                <ul className="space-y-2">
                  {view.matchups.map((key) => (
                    <li key={key}>
                      <Link href={`/${key.replace("/", "/matchup/")}`} className="text-ink underline decoration-blush-400/40 underline-offset-4 hover:text-blush-300">
                        {key.split("/")[1].split("--").map((id) => kb.champion(id).name).join(" vs ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-ink-faint">None yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
