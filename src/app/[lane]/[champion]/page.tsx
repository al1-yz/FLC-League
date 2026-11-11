import { notFound } from "next/navigation";
import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";
import { EtherealScene } from "@/ui/EtherealScene";
import { LaneGlyph } from "@/ui/LaneGlyph";
import { MatchupSearch } from "@/ui/MatchupSearch";
import { MatchupTable } from "@/ui/MatchupTable";

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
      <EtherealScene />

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

        <section aria-labelledby="matchups-title" className="reveal legible mt-16 w-full max-w-5xl" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="matchups-title" className="sheet__title !mb-0">Matchups</h2>
            <MatchupSearch lane={lane} focus={champion} champions={kb.champions()} />
          </div>
          {matchups.length ? (
            <div className="mt-6">
              <MatchupTable matchups={matchups} focus={champion} />
            </div>
          ) : (
            <p className="mt-6 text-sm italic text-ink-faint">No matchups studied yet. Search for an opponent to start one.</p>
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
