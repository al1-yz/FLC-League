import { loadKnowledgeBase } from "@/content";
import { contentDir } from "@/content/config";
import { EtherealScene } from "@/ui/EtherealScene";

export const dynamic = "force-dynamic";

/** Content report (FR-009): every rejected entry or file, where it is and which rule it breaks. */
export default function ValidationPage() {
  const { report } = loadKnowledgeBase(contentDir());
  const byFile = Map.groupBy(report.issues, (issue) => issue.file);

  return (
    <div className="legible relative">
      <EtherealScene />
      <div className="mx-auto max-w-4xl px-10 pt-16 pb-24">
        <p className="text-[0.72rem] uppercase tracking-[0.4em] text-ink-muted">Content repository · {contentDir()}</p>
        <h1 className="mt-4 text-5xl font-extralight uppercase tracking-[0.2em] text-ink">Content report</h1>
        <p className="mt-4 max-w-xl text-sm text-ink-muted">
          Entries that break a load rule are hidden from the app until they are fixed. Rules are described in the content format guide.
        </p>

        {report.issues.length === 0 ? (
          <p className="mt-16 flex items-center gap-3 text-lg font-light text-lavender-200">
            <span className="size-2 rounded-full bg-lavender-300 shadow-[0_0_10px_rgb(184_179_202/0.9)]" aria-hidden="true" />
            All content is valid.
          </p>
        ) : (
          <div className="mt-14 space-y-12">
            <p className="text-sm text-blush-300">
              {report.issues.length} issue{report.issues.length === 1 ? "" : "s"} in {byFile.size} file{byFile.size === 1 ? "" : "s"}
            </p>
            {[...byFile].map(([file, issues]) => (
              <section key={file}>
                <h2 className="sheet__title !mb-3 !tracking-[0.2em] normal-case">{file}</h2>
                <ul className="space-y-3 border-l border-blush-400/30 pl-6">
                  {issues.map((issue, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[1.6rem] top-2 size-1.5 rounded-full bg-blush-400 shadow-[0_0_8px_rgb(229_184_168/0.9)]" aria-hidden="true" />
                      <p className="flex flex-wrap items-baseline gap-3 text-sm">
                        <span className="chip">{issue.rule}</span>
                        {issue.entryId && <span className="font-mono text-xs text-ink-muted">{issue.entryId}</span>}
                        <span className="sr-only">{file}</span>
                      </p>
                      <p className="mt-1 text-ink">{issue.message}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
