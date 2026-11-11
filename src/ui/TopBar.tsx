import Link from "next/link";
import type { FocusChampion } from "@/content";

/**
 * Floating top bar (D16.2, D17.1): wordmark left, navigation centred, Patch right.
 * Lanes open a small menu of their Focus Champions.
 */
export function TopBar({ mid, bot, patch, issues }: { mid: FocusChampion[]; bot: FocusChampion[]; patch: string; issues: number }) {
  return (
    <header className="topbar">
      <nav aria-label="Main" className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5">
        <Link href="/" className="justify-self-start text-xl font-light tracking-[0.35em] text-ink">
          FLC
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
        <span className="flex items-center gap-2 justify-self-end">
          {issues > 0 && (
            <Link href="/validation" className="chip !border-blush-400/50 !text-blush-300 hover:!bg-blush-400/10">
              <span className="size-1.5 rounded-full bg-blush-400" aria-hidden="true" />
              {issues} content issue{issues === 1 ? "" : "s"}
            </Link>
          )}
          <span className="chip">Patch {patch}</span>
        </span>
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
