"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MatchupSummary } from "@/content";

type Column = { id: string; label: string; value: (m: MatchupSummary) => string | number | undefined };

const COLUMNS: Column[] = [
  { id: "opponent", label: "Opponent", value: (m) => m.opponent.name },
  { id: "archetype", label: "Archetype", value: (m) => m.opponentArchetype },
  { id: "verdict", label: "Your verdict", value: (m) => m.verdict },
  { id: "statistical", label: "Statistical", value: () => undefined },
  { id: "insights", label: "Insights", value: (m) => m.insights },
  { id: "unreviewed", label: "Unreviewed", value: (m) => m.unreviewed },
];

/** The Focus Champion's Matchups, sortable by every column (FR-029). Empty values sort last. */
export function MatchupTable({ matchups, focus }: { matchups: MatchupSummary[]; focus: string }) {
  const [sort, setSort] = useState<{ column: string; descending: boolean }>({ column: "opponent", descending: false });
  const rows = useMemo(() => {
    const column = COLUMNS.find((c) => c.id === sort.column)!;
    return [...matchups].sort((a, b) => {
      const x = column.value(a);
      const y = column.value(b);
      if (x === undefined) return 1;
      if (y === undefined) return -1;
      const order = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.descending ? -order : order;
    });
  }, [matchups, sort]);

  return (
    <table className="matchup-table w-full text-left">
      <thead>
        <tr>
          {COLUMNS.map((c) => (
            <th key={c.id} aria-sort={sort.column === c.id ? (sort.descending ? "descending" : "ascending") : "none"}>
              <button
                type="button"
                onClick={() => setSort((s) => ({ column: c.id, descending: s.column === c.id ? !s.descending : false }))}
                className="uppercase tracking-[0.2em] hover:text-ink"
              >
                {c.label}
                {sort.column === c.id && <span aria-hidden="true">{sort.descending ? " ↓" : " ↑"}</span>}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((m) => (
          <tr key={m.key}>
            <td>
              <Link href={`/${m.key.replace("/", "/matchup/")}?as=${focus}`} className="flex items-center gap-3 text-ink hover:text-blush-300">
                {m.opponent.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local Catalog file
                  <img src={m.opponent.icon} alt="" className="size-8 rounded-full" />
                ) : (
                  <span className="size-8 rounded-full bg-stone-600" />
                )}
                vs {m.opponent.name}
              </Link>
            </td>
            <td>{m.opponentArchetype ?? "—"}</td>
            <td className={m.verdict ? "text-blush-300" : ""}>{m.verdict ? `${m.verdict} / 5` : "—"}</td>
            <td className="text-ink-faint">not available</td>
            <td className="tabular-nums">{m.insights}</td>
            <td className={`tabular-nums ${m.unreviewed ? "text-lavender-200" : ""}`}>{m.unreviewed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
