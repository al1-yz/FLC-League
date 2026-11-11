import Link from "next/link";
import type { FocusChampion } from "@/content";

/**
 * Floating top bar (replaces the sidebar, D16.2). Lanes open a small menu of their Focus Champions.
 */
export function TopBar({ mid, bot, patch }: { mid: FocusChampion[]; bot: FocusChampion[]; patch: string }) {
  return (
    <header className="topbar">
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3.5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-light tracking-[0.35em] text-ink">FLC</span>
          <span className="hidden text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint md:inline">Full Lane Control</span>
        </Link>
        <ul className="flex items-center gap-1 text-[0.72rem] uppercase tracking-[0.18em]">
          <LaneMenu label="Mid lane" lane="mid" champions={mid} />
          <LaneMenu label="Bot lane" lane="bot" champions={bot} />
          <li>
            <span className="topbar__item cursor-default text-ink-faint" title="Coming with ticket 10">
              General Concepts
            </span>
          </li>
        </ul>
        <span className="ml-auto chip">Patch {patch}</span>
      </nav>
    </header>
  );
}

function LaneMenu({ label, lane, champions }: { label: string; lane: string; champions: FocusChampion[] }) {
  return (
    <li className="group relative">
      <span className="topbar__item">{label}</span>
      <ul className="topbar__menu">
        {champions.map((c) => (
          <li key={c.id}>
            <Link href={`/${lane}/${c.id}`} className="block rounded-lg px-3 py-2 normal-case tracking-normal text-ink-muted hover:bg-lavender-300/10 hover:text-ink">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
