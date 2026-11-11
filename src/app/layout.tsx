import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { Backdrop } from "@/ui/Backdrop";
import { TopBar } from "@/ui/TopBar";

export const metadata: Metadata = {
  title: "FLC — Full Lane Control",
  description: "Focus. Learn. Climb. A personal study of lane matchups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { kb } = loadKnowledgeBase(contentDir());

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Backdrop />
        <TopBar mid={kb.focusChampions("mid")} bot={kb.focusChampions("bot")} patch={kb.currentPatch()} />
        <main className="flex-1">{children}</main>
        <footer className="px-10 py-6 text-[0.68rem] leading-relaxed text-ink-faint">
          FLC isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or
          anyone officially involved in producing or managing Riot Games properties. Riot Games, and all
          associated properties are trademarks or registered trademarks of Riot Games, Inc.
        </footer>
      </body>
    </html>
  );
}
