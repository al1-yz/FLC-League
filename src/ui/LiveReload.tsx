"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-renders the page from the server when content changes, keeping client state such as typed text. */
export function LiveReload() {
  const router = useRouter();
  useEffect(() => {
    const events = new EventSource("/api/content-events");
    events.onmessage = () => router.refresh();
    // Lets tests (and the curious) see that live reload is active.
    events.addEventListener("ready", () => (document.documentElement.dataset.live = "ready"));
    return () => {
      events.close();
      delete document.documentElement.dataset.live;
    };
  }, [router]);
  return null;
}
