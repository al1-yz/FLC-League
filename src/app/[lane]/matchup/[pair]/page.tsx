import Link from "next/link";
import type { InsightView, SectionView } from "@/content";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { DetailCircle, LaneSection, PhaseStack } from "@/ui/Blueprint";
import { EtherealScene } from "@/ui/EtherealScene";
import { VerdictPanel } from "@/ui/VerdictPanel";
import { deleteMeNoteAction, recordVerdictAction, saveMeNoteAction } from "./actions";
import { Reveal } from "@/ui/Reveal";

export const dynamic = "force-dynamic";

/** Opens video Sources at the stored timestamp (e.g. "07:42" → t=462). */
function linkWithTimestamp(link: string, locator?: string): string {
  if (!locator || !/^\d+(:\d{2}){1,2}$/.test(locator)) return link;
  const seconds = locator.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  const url = new URL(link);
  url.searchParams.set("t", String(seconds));
  return url.toString();
}

/**
 * Matchup page as an architectural analysis sheet (D16.4): splash art above, then labelled
 * diagrams — game-phase stack, detail callouts, lane section — and the coach notes as plain,
 * numbered annotations.
 */
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
  const youProfile = kb.profile(you.id);
  const opponentProfile = kb.profile(opponent.id);

  const sections = view.groups.flatMap((g) => g.sections);
  const pick = (...ids: string[]) => ids.map((id) => sections.find((s) => s.id === id)).filter((s): s is SectionView => Boolean(s));
  const notes = view.groups.filter((g) => g.id !== "statistics");
  const insights = sections.flatMap((s) => s.insights);

  return (
    <div className="relative">
      <EtherealScene />

      {/* Title block */}
      <header className="legible mx-auto max-w-7xl px-10 pt-16 pb-10">
        <p className="reveal text-[0.85rem] uppercase tracking-[0.4em] text-ink-muted">
          {view.lane === "mid" ? "Mid lane" : "Bot lane"} · Matchup analysis · Patch {kb.currentPatch()}
        </p>
        <h1 className="reveal mt-4 text-6xl font-light uppercase tracking-[0.22em] text-ink md:text-7xl" style={{ "--i": 1 } as React.CSSProperties}>
          {you.name} <span className="text-blush-400">vs</span> {opponent.name}
        </h1>
        {view.switchTo && (
          <p className="reveal mt-4" style={{ "--i": 2 } as React.CSSProperties}>
            <Link href={`/${view.key.replace("/", "/matchup/")}?as=${view.switchTo}`} className="glass-pill">
              See it as {opponent.name} ⇄
            </Link>
          </p>
        )}
        <dl className="reveal mt-8 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-3 text-sm md:grid-cols-4" style={{ "--i": 2 } as React.CSSProperties}>
          <Spec label="You" value={you.name} />
          <Spec label="Archetype" value={youProfile.primaryArchetype ?? "—"} />
          <div>
            <dt className="text-[0.78rem] uppercase tracking-[0.28em] text-ink-faint">Opponent</dt>
            <dd className="mt-1">
              <Link href={`/opponents/${opponent.id}`} className="text-ink underline decoration-blush-400/40 underline-offset-4 hover:text-blush-300">
                {opponent.name}
              </Link>
            </dd>
          </div>
          <Spec label="Archetype" value={opponentProfile.primaryArchetype ?? "—"} />
          <Spec label="Coach notes" value={String(insights.length)} />
          <Spec label="Sections covered" value={`${sections.filter((s) => s.insights.length).length} / ${sections.length}`} />
          <Spec label="Your verdict" value={view.verdict ? `${view.verdict.latest.difficulty} / 5` : "—"} />
          <Spec label="Statistics" value="feature 002" />
        </dl>
      </header>

      <section className="mx-auto max-w-7xl px-10 pb-14">
        <VerdictPanel matchup={view.key} verdict={view.verdict} action={recordVerdictAction} />
      </section>

      {/* Analysis sheet */}
      <section aria-labelledby="analysis-title" className="mx-auto max-w-7xl px-10">
        <div className="reveal" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <h2 id="analysis-title" className="sheet__title">Analysis of the game plan</h2>
              <PhaseStack
                phases={[
                  { id: "power-spikes", label: "Power spikes", sections: pick("power-spikes") },
                  { id: "early-game", label: "Early game", sections: pick("early-game") },
                  { id: "mid-game", label: "Mid game", sections: pick("mid-game") },
                  { id: "late-game", label: "Late game", sections: pick("late-game") },
                ]}
              />
            </div>
            <div className="legible flex flex-col justify-center gap-10">
              <h2 className="sheet__title">Details</h2>
              <DetailCircle id="trading-patterns" label="Trading" motif="trade" sections={pick("trading-patterns", "trading-stance", "cooldown-windows")} />
              <DetailCircle id="all-in-windows" label="Windows" motif="window" sections={pick("all-in-windows", "kill-windows", "defensive-windows")} />
              <DetailCircle id="runes" label="Build" motif="build" sections={pick("runes", "summoner-spells", "itemization")} />
            </div>
          </div>

          <div className="mt-14">
            <h2 className="sheet__title">Lane section · levels 1–18</h2>
            <LaneSection
              spikes={(sections.find((s) => s.id === "power-spikes")?.insights ?? []).flatMap((i) =>
                i.spike && "level" in i.spike ? [{ level: i.spike.level, side: i.side }] : [],
              )}
            />
          </div>
        </div>
      </section>

      {/* Coach notes as a river: notes drift in along a winding line */}
      <section aria-labelledby="notes-title" className="legible relative mx-auto max-w-5xl px-10 py-24">
        <h2 id="notes-title" className="sheet__title text-center">Coach notes</h2>
        <svg className="river" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0 C 80 60, 20 120, 50 180 S 80 300, 50 360 S 20 480, 50 540 S 80 660, 50 720 S 20 840, 50 900 S 60 960, 50 1000" />
        </svg>
        <ol className="relative mt-12 space-y-16">
          {notes.flatMap((g) => g.sections).map((section, i) => (
            <li key={section.id} className={`md:w-[46%] ${i % 2 ? "md:ml-auto" : ""}`}>
              <Reveal delay={60}>
                <Annotation index={i + 1} section={section} opponent={opponent.name} matchup={view.key} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Statistics */}
      <section aria-labelledby="statistics-title" className="mx-auto max-w-7xl px-10 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6 pt-8">
          <div>
            <h2 id="statistics-title" className="sheet__title">Statistics</h2>
            <p className="max-w-xl text-sm text-ink-muted">
              Own statistics from the Riot API arrive with feature 002. A design prototype with sample data is ready for review.
            </p>
          </div>
          <Link href={`/prototype/stats?lane=${view.lane}&champion=${you.id}`} className="glass-pill">
            Open the statistics prototype →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.9rem] uppercase tracking-[0.28em] text-ink-faint">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

function Annotation({ index, section, opponent, matchup }: { index: number; section: SectionView; opponent: string; matchup: string }) {
  const inConflict = new Set(section.conflicts.flat());
  const byId = new Map(section.insights.map((i) => [i.id, i]));
  const plain = section.insights.filter((i) => !inConflict.has(i.id));
  return (
    <section id={section.id} className="scroll-mt-24">
      <h3 className="flex items-baseline gap-4 pb-2">
        <span aria-hidden="true" className="river__node" />
        <span className="text-sm font-normal tabular-nums text-blush-400">{String(index).padStart(2, "0")}</span>
        <span className="text-[0.9rem] uppercase tracking-[0.3em] text-ink">{section.title}</span>
      </h3>
      {section.insights.length === 0 && section.meNotes.length === 0 && <p className="mt-4 text-sm italic text-ink-faint">Awaiting coach notes.</p>}

      {section.spikeGroups ? (
        <div className="mt-4 space-y-6">
          {section.spikeGroups.map((group) => (
            <div key={group.label}>
              <p className="pl-9 text-[0.82rem] uppercase tracking-[0.25em] text-lavender-300">{group.label}</p>
              <ul className="mt-2 space-y-5">
                {group.insights.map((insight) => (
                  <Note key={insight.id} insight={insight} opponent={opponent} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        plain.length > 0 && (
          <ul className="mt-4 space-y-5">
            {plain.map((insight) => (
              <Note key={insight.id} insight={insight} opponent={opponent} />
            ))}
          </ul>
        )
      )}

      {section.conflicts.map(([x, y]) => (
        <div key={`${x}-${y}`} className="mt-6 pl-9" role="group" aria-label="Conflicting coach notes">
          <p className="mb-3 flex items-center gap-2 text-[0.82rem] uppercase tracking-[0.25em] text-blush-300">
            <span aria-hidden="true">⇄</span> Coaches disagree
          </p>
          <ul className="grid gap-6 border-l border-blush-400/40 pl-5 md:grid-cols-2">
            {[x, y].map((id) => byId.get(id)).filter((i): i is InsightView => Boolean(i)).map((insight) => (
              <Note key={insight.id} insight={insight} opponent={opponent} indent={false} />
            ))}
          </ul>
        </div>
      ))}
      <MeNotes section={section} matchup={matchup} />
    </section>
  );
}

function MeNotes({ section, matchup }: { section: SectionView; matchup: string }) {
  return (
    <div className="mt-5 pl-9">
      {section.meNotes.length > 0 && (
        <ul aria-label={`Your notes on ${section.title}`} className="space-y-3">
          {section.meNotes.map((note) => (
            <li key={note.id} className="me-note">
              <p className="text-ink">{note.text}</p>
              <form action={deleteMeNoteAction} className="mt-1 flex items-center gap-3 text-[0.82rem] uppercase tracking-[0.18em] text-lavender-300">
                <span>Me · {note.updatedAt}</span>
                <input type="hidden" name="id" value={note.id} />
                <button type="submit" className="text-ink-faint hover:text-blush-300">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-ink-faint hover:text-lavender-200">+ Add your note</summary>
        <form action={saveMeNoteAction} className="mt-2 flex gap-2">
          <input type="hidden" name="matchup" value={matchup} />
          <input type="hidden" name="section" value={section.id} />
          <input name="text" required aria-label={`Your note on ${section.title}`} placeholder="What did you notice?" className="field flex-1" />
          <button type="submit" className="glass-pill">Save</button>
        </form>
      </details>
    </div>
  );
}

function Note({ insight, opponent, indent = true }: { insight: InsightView; opponent: string; indent?: boolean }) {
  const side = insight.side === "you" ? "You" : insight.side === "opponent" ? opponent : "Both";
  return (
    <li>
      <article className={`${indent ? "pl-9" : ""} transition-transform duration-700 hover:translate-x-1 ${insight.outdated ? "opacity-70" : ""}`}>
        <p className="mb-1.5 flex flex-wrap items-center gap-2 text-[0.8rem]">
          <span className={`chip ${insight.side === "you" ? "!text-blush-300 !border-blush-400/40" : ""}`}>{side}</span>
          {insight.outdated && <span className="chip !text-ink-faint">Possibly outdated · {insight.patch}</span>}
        </p>
        <p className="leading-relaxed text-ink-muted">{insight.claim}</p>
        {insight.quote && <p className="mt-2 text-sm italic text-lavender-200">“{insight.quote}”</p>}
        <p className="mt-2 text-[0.82rem] uppercase tracking-[0.18em] text-ink-faint">
          <a href={linkWithTimestamp(insight.link, insight.locator)} target="_blank" rel="noreferrer" className="text-blush-400 hover:text-blush-300">
            {insight.source.name}
            {insight.locator && ` @ ${insight.locator}`}
          </a>
          {" · "}Patch {insight.patch} · noted {insight.noted}
        </p>
      </article>
    </li>
  );
}
