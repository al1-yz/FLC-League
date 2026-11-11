import Link from "next/link";
import { notFound } from "next/navigation";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { EtherealScene } from "@/ui/EtherealScene";

export const dynamic = "force-dynamic";

/** Opponent page (FR-032): Archetypes, champion-level Insights and every Matchup involving them. */
export default async function OpponentPage({ params }: { params: Promise<{ champion: string }> }) {
  const { champion } = await params;
  const { kb } = loadKnowledgeBase(contentDir());
  if (!kb.champions().some((c) => c.id === champion)) notFound();
  const opponent = kb.opponent(champion);

  return (
    <div className="legible relative">
      <EtherealScene />
      <div className="mx-auto max-w-5xl px-10 pt-16 pb-24">
        <p className="text-[0.85rem] uppercase tracking-[0.4em] text-ink-muted">Opponent</p>
        <div className="mt-4 flex items-center gap-6">
          {opponent.icon && (
            // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
            <img src={opponent.icon} alt="" className="size-20 rounded-full ring-1 ring-lavender-300/40" />
          )}
          <h1 className="text-6xl font-light uppercase tracking-[0.2em] text-ink">{opponent.name}</h1>
        </div>
        <dl className="mt-8 flex flex-wrap gap-3">
          <div className="reading">
            <dt className="reading__icon" title="Archetype">◇<span className="sr-only">Archetype</span></dt>
            <dd className="pr-1">{opponent.primaryArchetype ?? "Archetype not classified"}</dd>
          </div>
          {opponent.secondaryArchetype && (
            <div className="reading">
              <dt className="reading__icon" title="Secondary Archetype">◇<span className="sr-only">Secondary Archetype</span></dt>
              <dd className="pr-1">{opponent.secondaryArchetype}</dd>
            </div>
          )}
          <div className="reading">
            <dt className="reading__icon" title="Species">◌<span className="sr-only">Species</span></dt>
            <dd className="pr-1">{opponent.species ?? "—"}</dd>
          </div>
        </dl>

        <section aria-labelledby="traits-title" className="mt-16">
          <h2 id="traits-title" className="sheet__title">General traits</h2>
          {opponent.insights.length ? (
            <ul className="space-y-6">
              {opponent.insights.map((insight) => (
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
            <p className="text-sm italic text-ink-faint">No coach notes about {opponent.name} yet.</p>
          )}
        </section>

        <section aria-labelledby="opponent-matchups-title" className="mt-16">
          <h2 id="opponent-matchups-title" className="sheet__title">Matchups</h2>
          {opponent.matchups.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {opponent.matchups.map((m) => (
                <li key={m.key}>
                  <Link href={`/${m.key.replace("/", "/matchup/")}?as=${m.other.id}`} className="glass-row">
                    <span className="flex-1 text-ink">
                      {opponent.name} vs {m.other.name}
                      <span className="block text-xs uppercase tracking-[0.2em] text-ink-faint">{m.lane === "mid" ? "Mid lane" : "Bot lane"}</span>
                    </span>
                    <span aria-hidden="true" className="text-blush-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-ink-faint">No matchups against your Focus Champions yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
