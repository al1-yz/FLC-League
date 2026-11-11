import { watch, type FSWatcher } from "chokidar";

type Listener = () => void;

/**
 * One file watcher per process over the Content Repository (FR-026c). Listeners are told, at most
 * every 150 ms, that something changed; they decide what to reload.
 */
const state = globalThis as typeof globalThis & {
  __flcWatcher?: { dir: string; watcher: FSWatcher; listeners: Set<Listener>; ready: Promise<void> };
};

/** Subscribes to changes; `ready` resolves once the watcher has finished its initial scan. */
export function onContentChange(dir: string, listener: Listener): { ready: Promise<void>; unsubscribe: () => void } {
  // Recreate on a different directory, or when hot reload left a watcher from older code behind.
  if (!state.__flcWatcher || state.__flcWatcher.dir !== dir || !state.__flcWatcher.ready) {
    void state.__flcWatcher?.watcher.close();
    const listeners = new Set<Listener>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const watcher = watch(dir, { ignoreInitial: true, ignored: (path) => path.includes("/.git") });
    watcher.on("all", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // A failing listener (e.g. a closed browser stream) must not silence the others.
        for (const listener of [...listeners]) {
          try {
            listener();
          } catch {
            listeners.delete(listener);
          }
        }
      }, 150);
    });
    const ready = new Promise<void>((resolve) => watcher.once("ready", () => resolve()));
    state.__flcWatcher = { dir, watcher, listeners, ready };
  }
  const { listeners, ready } = state.__flcWatcher;
  listeners.add(listener);
  return { ready, unsubscribe: () => void listeners.delete(listener) };
}
