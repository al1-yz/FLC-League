"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChampionView } from "@/content";

/** Opens the Matchup against any Catalog champion, even one with no content yet (FR-031). */
export function MatchupSearch({ lane, focus, champions }: { lane: string; focus: string; champions: ChampionView[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const open = (event: React.FormEvent) => {
    event.preventDefault();
    const match = champions.find((c) => c.name.toLowerCase() === query.trim().toLowerCase());
    if (!match || match.id === focus) return setError("Pick another champion from the list.");
    const [a, b] = [focus, match.id].sort();
    router.push(`/${lane}/matchup/${a}--${b}?as=${focus}`);
  };

  return (
    <form onSubmit={open} className="flex flex-wrap items-center gap-3">
      <input
        list="champion-list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setError("");
        }}
        aria-label="Find a matchup against"
        placeholder="Find a matchup against…"
        className="field w-64"
      />
      <datalist id="champion-list">
        {champions.filter((c) => c.id !== focus).map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <button type="submit" className="glass-pill">Open</button>
      {error && <span className="text-sm text-blush-300">{error}</span>}
    </form>
  );
}
