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
    <article className="rounded-lg border border-panel-border bg-panel p-4 backdrop-blur">
      <p>{insight.claim}</p>
      {insight.quote && <blockquote className="mt-2 italic text-ink-muted">“{insight.quote}”</blockquote>}
      <p className="mt-3 text-xs text-ink-muted">
        <a href={linkWithTimestamp(insight.link, insight.locator)} className="text-accent hover:underline">
          {insight.source.name}
          {insight.locator && ` @ ${insight.locator}`}
        </a>
        {" · "}Patch {insight.patch}
        {" · "}noted {insight.noted}
      </p>
    </article>
  );
}
