import type { InsightView } from "@/content";

/** Opens video Sources at the stored timestamp (e.g. "07:42" → t=462). */
function linkWithTimestamp(link: string, locator?: string): string {
  if (!locator || !/^\d+(:\d{2}){1,2}$/.test(locator)) return link;
  const seconds = locator.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  const url = new URL(link);
  url.searchParams.set("t", String(seconds));
  return url.toString();
}

export function InsightCard({ insight }: { insight: InsightView }) {
  return (
    <article className="panel panel--interactive p-5">
      <p className="text-[0.98rem] leading-relaxed text-ink">{insight.claim}</p>
      {insight.quote && (
        <blockquote className="mt-3 border-l border-gold-600/60 pl-3 font-display italic text-gold-300">
          “{insight.quote}”
        </blockquote>
      )}
      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <a
          href={linkWithTimestamp(insight.link, insight.locator)}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-gold-400 underline decoration-gold-700 underline-offset-4 transition-colors hover:text-gold-200 hover:decoration-gold-400"
        >
          {insight.source.name}
          {insight.locator && <span className="text-ink-faint"> @ {insight.locator}</span>}
        </a>
        <span className="chip">Patch {insight.patch}</span>
        <span className="text-ink-faint">noted {insight.noted}</span>
      </footer>
    </article>
  );
}
