import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
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
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen">
        <Backdrop />
        <nav className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-lavender-300/10 bg-night-950/70 px-6 py-8 backdrop-blur-xl">
          <Link href="/" className="group mb-10 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-blush-400 shadow-[0_0_12px_rgb(229_184_168/0.9)] transition-transform duration-700 group-hover:scale-150"
            />
            <span className="text-lg font-medium tracking-tight text-ink">LoLMechs</span>
          </Link>
          <div className="space-y-8">
            {LANES.map((lane) => (
              <section key={lane.id}>
                <p className="eyebrow mb-3">{lane.name}</p>
                <ul className="space-y-1">
                  {kb.focusChampions(lane.id).map((champion) => (
                    <li
                      key={champion.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-ink-muted transition-colors hover:bg-lavender-300/5 hover:text-ink"
                    >
                      <span aria-hidden="true" className="size-1 rounded-full bg-mauve-500" />
                      {champion.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section>
              <p className="eyebrow eyebrow--cool mb-3">Learn</p>
              <ul className="space-y-1 text-sm text-ink-muted">
                <li className="flex items-center gap-3 px-2 py-1.5">
                  <span aria-hidden="true" className="size-1 rounded-full bg-lavender-300" />
                  General Concepts
                </li>
              </ul>
            </section>
          </div>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-10 py-12">{children}</main>
          <footer className="border-t border-lavender-300/10 px-10 py-5 text-[0.7rem] leading-relaxed text-ink-faint">
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
