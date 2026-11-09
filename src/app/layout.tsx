import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jost";
import "./globals.css";
import { loadKnowledgeBase, type Lane } from "@/content";
import { contentDir } from "@/content/config";
import { Backdrop } from "@/ui/Backdrop";

export const metadata: Metadata = { title: "LoLMechs", description: "Personal matchup study tool" };

const LANES: { id: Lane; name: string }[] = [
  { id: "mid", name: "Mid" },
  { id: "bot", name: "Bot" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { kb } = loadKnowledgeBase(contentDir());

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Backdrop />
        <nav className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gold-500/15 bg-violet-950/60 px-6 py-8 backdrop-blur-xl">
          <Link href="/" className="group mb-10 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-3 rotate-45 border border-gold-500 transition-transform duration-700 group-hover:rotate-[225deg]"
            />
            <span className="font-display text-xl tracking-wide text-gold-300">LoLMechs</span>
          </Link>
          <div className="space-y-8">
            {LANES.map((lane) => (
              <section key={lane.id}>
                <p className="eyebrow mb-3">{lane.name}</p>
                <ul className="space-y-1">
                  {kb.focusChampions(lane.id).map((champion) => (
                    <li
                      key={champion.id}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-ink-muted transition-colors hover:bg-gold-500/5 hover:text-ink"
                    >
                      <span aria-hidden="true" className="size-1 rounded-full bg-gold-600" />
                      {champion.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-10 py-12">{children}</main>
          <footer className="border-t border-gold-500/10 px-10 py-5 text-[0.7rem] leading-relaxed text-ink-faint">
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
