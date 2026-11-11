import Link from "next/link";
import { notFound } from "next/navigation";
import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";
import { ChampionBackdrop } from "@/ui/ChampionBackdrop";
import { LaneGlyph } from "@/ui/LaneGlyph";

export const dynamic = "force-dynamic";

/**
 * Focus Champion page (D16.3): a glass capsule over the champion's splash art, in the spirit of a
 * weather card — lane where the weather goes, the champion's name as the place, Archetype and
 * species as the readings. Matchups follow below.
 */
export default async function ChampionPage({ params }: { params: Promise<{ lane: string; champion: string }> }) {
  const { lane, champion } = await params;
  if (lane !== "mid" && lane !== "bot") notFound();
  const { kb } = loadKnowledgeBase(contentDir());
  const focus = kb.focusChampions(lane as Lane).find((c) => c.id === champion);
  if (!focus) notFound();
  const profile = kb.profile(champion);
  const matchups = kb.matchupsFor(champion, lane as Lane);

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)]">
      <ChampionBackdrop splash={profile.splash} label={profile.skin} />

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pt-10 pb-16">
        <article className="capsule reveal" aria-labelledby="champion-name">
          <div className="capsule__window">
            {profile.splash ? (
              // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
              <img src={profile.splash} alt="" className="h-full w-full object-cover object-[70%_25%]" />
            ) : (
              <div className="h-full w-full bg-stone-700" />
            )}
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-muted">
            <LaneGlyph lane={lane as Lane} />
            {lane === "mid" ? "Mid lane" : "Bot lane"}
          </p>
          <h1 id="champion-name" className="mt-2 text-center text-6xl font-light tracking-tight text-ink">
            {profile.name}
          </h1>
          <p className="mt-2 text-center text-sm text-ink-faint">Patch {kb.currentPatch()}</p>
          <dl className="mt-8 flex flex-wrap justify-center gap-3">
            <Reading label="Archetype" value={profile.primaryArchetype} icon="◇" />
            <Reading label="Species" value={profile.species} icon="◌" />
          </dl>
          <p className="mt-5 text-center text-sm text-ink-muted">
            {profile.secondaryArchetype ? `also ${profile.secondaryArchetype} · ` : ""}
            {matchups.length} matchup{matchups.length === 1 ? "" : "s"} studied
          </p>
        </article>

        <section aria-labelledby="matchups-title" className="reveal mt-16 w-full max-w-3xl" style={{ "--i": 3 } as React.CSSProperties}>
          <h2 id="matchups-title" className="text-center text-[0.72rem] uppercase tracking-[0.3em] text-ink-muted">
            Matchups
          </h2>
          {matchups.length ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {matchups.map((m) => (
                <li key={m.key}>
                  <Link href={`/${m.key.replace("/", "/matchup/")}?as=${champion}`} className="glass-row">
                    {m.opponent.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
                      <img src={m.opponent.icon} alt="" className="size-10 rounded-full" />
                    ) : (
                      <span className="size-10 rounded-full bg-stone-600" />
                    )}
                    <span className="flex-1">
                      <span className="block text-ink">vs {m.opponent.name}</span>
                      <span className="text-xs text-ink-faint">
                        {m.insights} insight{m.insights === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-blush-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-center text-sm italic text-ink-faint">No matchups studied yet.</p>
          )}
        </section>
      </section>
    </div>
  );
}

function Reading({ label, value, icon }: { label: string; value?: string; icon: string }) {
  return (
    <div className="reading">
      <dt className="reading__icon" title={label}>
        <span aria-hidden="true">{icon}</span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="pr-1">{value ?? "—"}</dd>
    </div>
  );
}
