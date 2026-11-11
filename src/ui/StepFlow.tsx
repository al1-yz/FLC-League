import type { InsightView, SectionView } from "@/content";

export type Step = {
  id: string;
  title: string;
  /** The question this step answers, in the voice of a coach. */
  prompt: string;
  sections: SectionView[];
};

/** Opens video Sources at the stored timestamp (e.g. "07:42" → t=462). */
function linkWithTimestamp(link: string, locator?: string): string {
  if (!locator || !/^\d+(:\d{2}){1,2}$/.test(locator)) return link;
  const seconds = locator.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  const url = new URL(link);
  url.searchParams.set("t", String(seconds));
  return url.toString();
}

/**
 * The Matchup game plan as connected steps (docs/design/reference-step-flow.png):
 * cards alternate sides and are joined by glowing connectors with a spark running along them.
 */
export function StepFlow({ steps }: { steps: Step[] }) {
  return (
    <ol className="mx-auto max-w-5xl">
      {steps.map((step, index) => {
        const left = index % 2 === 0;
        return (
          <li key={step.id} id={step.id} className="scroll-mt-16">
            {index > 0 && <Connector fromLeft={!left} />}
            <StepCard step={step} index={index} align={left ? "left" : "right"} />
          </li>
        );
      })}
    </ol>
  );
}

function Connector({ fromLeft }: { fromLeft: boolean }) {
  // Card centres sit at 30% (left cards) and 70% (right cards) of the row width.
  const from = fromLeft ? 30 : 70;
  const to = fromLeft ? 70 : 30;
  const turn = fromLeft ? 1 : -1;
  const d = `M ${from} 0 V 26 Q ${from} 36 ${from + turn * 4} 36 H ${to - turn * 4} Q ${to} 36 ${to} 46 V 72`;
  return (
    <div className="connector" aria-hidden="true">
      <svg viewBox="0 0 100 72" preserveAspectRatio="none">
        <path d={d} className="connector__line" />
        <path d={d} className="connector__spark" pathLength={100} />
      </svg>
      <span className="connector__dot" style={{ left: `${from}%`, top: 0 }} />
      <span className="connector__dot" style={{ left: `${to}%`, top: "100%" }} />
    </div>
  );
}

function StepCard({ step, index, align }: { step: Step; index: number; align: "left" | "right" }) {
  const insights = step.sections.flatMap((s) => s.insights);
  return (
    <article
      aria-labelledby={`${step.id}-title`}
      className={`panel step-card reveal w-full p-8 md:w-[62%] ${align === "right" ? "md:ml-auto" : ""} ${
        insights.length ? "step-card--lit" : ""
      }`}
      style={{ "--i": index + 3 } as React.CSSProperties}
    >
      <p className="eyebrow">Step {index + 1}</p>
      <h2 id={`${step.id}-title`} className="mt-3 text-3xl font-normal tracking-tight text-ink">
        {step.title}
      </h2>
      <div className="mt-5 h-px w-2/3 bg-gradient-to-r from-lavender-300/30 to-transparent" />
      <p className="mt-5 text-lg text-ink-muted">{step.prompt}</p>

      <div className="mt-6 space-y-4">
        {step.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-16">
            {step.sections.length > 1 && (
              <h3 className="mb-2 text-sm font-medium uppercase tracking-[0.12em] text-lavender-300">{section.title}</h3>
            )}
            {step.sections.length === 1 && <h3 className="sr-only">{section.title}</h3>}
            {section.insights.length ? (
              <ul className="space-y-2.5">
                {section.insights.map((insight) => (
                  <InsightChoice key={insight.id} insight={insight} />
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-ink-faint">No coach covers this yet.</p>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

function InsightChoice({ insight }: { insight: InsightView }) {
  return (
    <li>
      <article className="choice flex gap-4 p-4">
        <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-full border border-blush-400" />
        <div className="min-w-0">
          <p className="leading-relaxed text-ink">{insight.claim}</p>
          {insight.quote && <p className="mt-2 text-sm italic text-lavender-200">“{insight.quote}”</p>}
          <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
            <a
              href={linkWithTimestamp(insight.link, insight.locator)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blush-400 underline decoration-blush-400/30 underline-offset-4 hover:decoration-blush-400"
            >
              {insight.source.name}
              {insight.locator && ` @ ${insight.locator}`}
            </a>
            <span className="chip">Patch {insight.patch}</span>
            <span>noted {insight.noted}</span>
          </p>
        </div>
      </article>
    </li>
  );
}
