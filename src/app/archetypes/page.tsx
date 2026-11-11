import Link from "next/link";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { EtherealScene } from "@/ui/EtherealScene";

export const dynamic = "force-dynamic";

/** Index of Archetype Matchups that have written principles (FR-034). */
export default function ArchetypesIndex() {
  const { kb } = loadKnowledgeBase(contentDir());
  const list = kb.archetypeMatchups();

  return (
    <div className="legible relative">
      <EtherealScene />
      <div className="mx-auto max-w-4xl px-10 pt-16 pb-24">
        <p className="text-[0.85rem] uppercase tracking-[0.4em] text-ink-muted">What to pick against a kind of champion</p>
        <h1 className="mt-4 text-6xl font-light uppercase tracking-[0.2em] text-ink">Archetypes</h1>
        {list.length ? (
          <ul className="mt-14 grid gap-3 sm:grid-cols-2">
            {list.map((a) => (
              <li key={a.key}>
                <Link href={`/archetypes/${a.key}`} className="glass-row">
                  <span className="flex-1 text-ink">
                    {a.names[0]} vs {a.names[1]}
                    <span className="block text-xs uppercase tracking-[0.2em] text-ink-faint">
                      {a.lane === "mid" ? "Mid lane" : "Bot lane"} · {a.insights} coach note{a.insights === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-blush-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-14 text-sm italic text-ink-faint">No Archetype Matchups written yet.</p>
        )}
      </div>
    </div>
  );
}
