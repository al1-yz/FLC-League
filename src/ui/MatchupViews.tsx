"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChampionView, MatchupSummary } from "@/content";
import { MatchupTable } from "./MatchupTable";

type Signal = "verdict" | "statistical";

/** Table (default) or radial graph of a Focus Champion's Matchups (FR-029, FR-030). */
export function MatchupViews({ matchups, focus }: { matchups: MatchupSummary[]; focus: ChampionView }) {
  const [view, setView] = useState<"table" | "graph">("table");
  const [signal, setSignal] = useState<Signal>("verdict");
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3" role="group" aria-label="Matchup view">
        {(["table", "graph"] as const).map((v) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`glass-pill ${view === v ? "!border-blush-400/60 !bg-blush-400/15" : ""}`}>
            {v === "table" ? "Table" : "Graph"}
          </button>
        ))}
        {view === "graph" && (
          <label className="ml-auto flex items-center gap-2 text-sm text-ink-muted">
            Colour by
            <select value={signal} onChange={(e) => setSignal(e.target.value as Signal)} className="field">
              <option value="verdict">Your verdict</option>
              <option value="statistical">Statistical difficulty</option>
            </select>
          </label>
        )}
      </div>
      {view === "table" ? <MatchupTable matchups={matchups} focus={focus.id} /> : <RadialGraph matchups={matchups} focus={focus} signal={signal} />}
    </div>
  );
}

/** Blush for hard, lavender for easy, neutral when the signal is missing. Never a blend of signals. */
function colour(m: MatchupSummary, signal: Signal): string {
  const value = signal === "verdict" ? m.verdict : undefined; // statistical difficulty arrives with feature 002
  if (value === undefined) return "rgb(166 157 151 / 0.6)";
  return ["#b8b3ca", "#c9bdc8", "#d8c2bd", "#e2bbac", "#e5b8a8"][value - 1];
}

function RadialGraph({ matchups, focus, signal }: { matchups: MatchupSummary[]; focus: ChampionView; signal: Signal }) {
  const size = 520;
  const c = size / 2;
  const r = 190;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[34rem] overflow-visible" role="img" aria-label={`${focus.name}'s matchups as a radial graph`}>
      <defs>
        <clipPath id="radial-node">
          <circle r="22" />
        </clipPath>
        <clipPath id="radial-focus">
          <circle cx={c} cy={c} r="38" />
        </clipPath>
      </defs>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgb(184 179 202 / 0.12)" strokeDasharray="2 6" className="orbit" style={{ transformOrigin: `${c}px ${c}px`, animationDuration: "90s" }} />
      {matchups.map((m, i) => {
        const angle = (i / Math.max(matchups.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const x = c + Math.cos(angle) * r;
        const y = c + Math.sin(angle) * r;
        const tone = colour(m, signal);
        return (
          <g key={m.key}>
            <path d={`M ${c} ${c} Q ${c + Math.cos(angle + 0.3) * r * 0.5} ${c + Math.sin(angle + 0.3) * r * 0.5} ${x} ${y}`} fill="none" stroke={tone} strokeOpacity="0.5" />
            <Link href={`/${m.key.replace("/", "/matchup/")}?as=${focus.id}`} aria-label={`vs ${m.opponent.name}`}>
              <g transform={`translate(${x} ${y})`} className="cursor-pointer">
                <circle r="26" fill="#1b1a16" stroke={tone} strokeWidth="2" />
                {m.opponent.icon ? (
                  <image href={m.opponent.icon} x="-22" y="-22" width="44" height="44" clipPath="url(#radial-node)" />
                ) : (
                  <text textAnchor="middle" dy="5" fontSize="13" fill="#f2eeea">{m.opponent.name.slice(0, 3)}</text>
                )}
                <text textAnchor="middle" y="44" fontSize="14" fill="#f2eeea">{m.opponent.name}</text>
                <text textAnchor="middle" y="60" fontSize="12.5" fill={tone}>
                  {signal === "verdict" ? (m.verdict ? `${m.verdict} / 5` : "no verdict") : "n/a"}
                </text>
              </g>
            </Link>
          </g>
        );
      })}
      <circle cx={c} cy={c} r="44" fill="none" stroke="#e5b8a8" strokeOpacity="0.35" className="breathe-ring" style={{ transformOrigin: `${c}px ${c}px` }} />
      <circle cx={c} cy={c} r="40" fill="#23211b" stroke="#e5b8a8" />
      {focus.icon && <image href={focus.icon} x={c - 38} y={c - 38} width="76" height="76" clipPath="url(#radial-focus)" />}
    </svg>
  );
}
