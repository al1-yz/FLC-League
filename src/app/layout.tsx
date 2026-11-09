import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "LoLMechs", description: "Personal matchup study tool" };

const LANES = [
  { id: "mid", name: "Mid" },
  { id: "bot", name: "Bot" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <nav className="w-60 shrink-0 border-r border-panel-border bg-panel p-4 backdrop-blur">
          <Link href="/" className="mb-6 block text-lg font-semibold text-accent">
            LoLMechs
          </Link>
          <ul className="space-y-1 text-sm">
            {LANES.map((lane) => (
              <li key={lane.id} className="text-ink-muted">
                {lane.name}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-8">{children}</main>
          <footer className="border-t border-panel-border p-4 text-xs text-ink-muted">
            LoLMechs isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot
            Games or anyone officially involved in producing or managing Riot Games properties. Riot
            Games, and all associated properties are trademarks or registered trademarks of Riot
            Games, Inc.
          </footer>
        </div>
      </body>
    </html>
  );
}
