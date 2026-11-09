import type { SectionView } from "@/content";
import { InsightCard } from "./InsightCard";

/** One Section of a Matchup: title, count, and its credited Insights (or a gap marker). */
export function SectionBlock({ section }: { section: SectionView }) {
  const count = section.insights.length;
  return (
    <section id={section.id} className="scroll-mt-12">
      <div className="mb-3 flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className={`size-1.5 rotate-45 ${count > 0 ? "bg-gold-400" : "border border-gold-700"}`}
        />
        <h3 className="font-display text-lg text-gold-200">{section.title}</h3>
        {count > 0 && <span className="ml-auto text-xs tabular-nums text-gold-500">{count}</span>}
      </div>
      {count > 0 ? (
        <div className="space-y-3">
          {section.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      ) : (
        <p className="pl-5 text-sm italic text-ink-faint">No Source covers this yet.</p>
      )}
    </section>
  );
}
