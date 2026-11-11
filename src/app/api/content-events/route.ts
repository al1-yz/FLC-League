import { contentDir } from "@/content/config";
import { onContentChange } from "@/content/watch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Server-Sent Events: emits `changed` whenever a file in the Content Repository changes (FR-026c). */
export function GET(request: Request) {
  const encoder = new TextEncoder();
  let stop = () => {};
  const stream = new ReadableStream({
    start(controller) {
      // Throws once the browser has gone; the watcher then drops this listener.
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      const { ready, unsubscribe } = onContentChange(contentDir(), () => send("data: changed\n\n"));
      void ready.then(() => {
        try {
          send("event: ready\ndata: watching\n\n");
        } catch {
          stop();
        }
      });
      const keepAlive = setInterval(() => {
        try {
          send(": ping\n\n");
        } catch {
          stop();
        }
      }, 25_000);
      stop = () => {
        unsubscribe();
        clearInterval(keepAlive);
      };
      request.signal.addEventListener("abort", () => {
        stop();
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
    cancel() {
      stop();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform", connection: "keep-alive" },
  });
}
