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
      const { ready, unsubscribe } = onContentChange(contentDir(), () => controller.enqueue(encoder.encode("data: changed\n\n")));
      void ready.then(() => controller.enqueue(encoder.encode("event: ready\ndata: watching\n\n")));
      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(": ping\n\n")), 25_000);
      stop = () => {
        unsubscribe();
        clearInterval(keepAlive);
      };
      request.signal.addEventListener("abort", () => {
        stop();
        controller.close();
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
