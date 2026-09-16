"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import type { WatchlistPayload } from "@/lib/member-types";
import { mediaTitle } from "@/lib/media";

type SaveFailure = { media: MediaItem; saved: boolean; message: string };
type ListContextValue = {
  items: MediaItem[];
  ready: boolean;
  loadError: string | null;
  has: (media: MediaItem) => boolean;
  isPending: (media: MediaItem) => boolean;
  toggle: (media: MediaItem) => void;
};

const ListContext = createContext<ListContextValue | null>(null);
const mediaKey = (media: MediaItem) => `${media.media_type}:${media.id}`;

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Please check your connection and try again.");
  return body;
}

// AppProviders keys this component by profile so requests and state cannot cross profiles.
export function WatchlistProvider({ children, profileId }: { children: React.ReactNode; profileId?: string }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const [failures, setFailures] = useState<Record<string, SaveFailure>>({});
  const pendingRequests = useRef(new Map<string, AbortController>());

  useEffect(() => {
    if (!profileId) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let active = true;
    fetch(`/api/watchlist?profileId=${encodeURIComponent(profileId)}`, { cache: "no-store", signal: controller.signal })
      .then(readResponse<WatchlistPayload>)
      .then((payload) => {
        if (!active) return;
        setItems(payload.items);
        setReady(true);
      })
      .catch(() => {
        if (active) setLoadError("Your saved titles could not be loaded.");
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [profileId, loadAttempt]);

  useEffect(() => {
    const requests = pendingRequests.current;
    return () => {
      requests.forEach((controller) => controller.abort());
      requests.clear();
    };
  }, []);

  const clearFailure = useCallback((key: string) => {
    setFailures((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const save = useCallback(async (media: MediaItem, saved: boolean) => {
    if (!profileId || !ready) return;
    const key = mediaKey(media);
    // The ref also catches duplicate clicks before React renders the disabled button.
    if (pendingRequests.current.has(key)) return;
    const controller = new AbortController();
    pendingRequests.current.set(key, controller);
    setPendingKeys(new Set(pendingRequests.current.keys()));
    clearFailure(key);
    const timeout = window.setTimeout(() => controller.abort("timeout"), 10000);

    try {
      await fetch("/api/watchlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, media, saved }),
        signal: controller.signal,
      }).then(readResponse<{ success: boolean }>);
      if (controller.signal.aborted) return;
      // Apply only this confirmed change. A failed request never rolls back other titles.
      setItems((current) => {
        const remaining = current.filter((item) => mediaKey(item) !== key);
        return saved ? [media, ...remaining] : remaining;
      });
    } catch (error) {
      if (!controller.signal.aborted || controller.signal.reason === "timeout") {
        setFailures((current) => ({
          ...current,
          [key]: { media, saved, message: error instanceof Error ? error.message : "Please check your connection and try again." },
        }));
      }
    } finally {
      window.clearTimeout(timeout);
      if (pendingRequests.current.get(key) === controller) {
        pendingRequests.current.delete(key);
        setPendingKeys(new Set(pendingRequests.current.keys()));
      }
    }
  }, [clearFailure, profileId, ready]);

  const has = useCallback((media: MediaItem) => items.some((item) => mediaKey(item) === mediaKey(media)), [items]);
  const isPending = useCallback((media: MediaItem) => pendingKeys.has(mediaKey(media)), [pendingKeys]);
  const toggle = useCallback((media: MediaItem) => { void save(media, !has(media)); }, [has, save]);
  const value = useMemo(() => ({ items, ready, loadError, has, isPending, toggle }), [items, ready, loadError, has, isPending, toggle]);

  return (
    <ListContext.Provider value={value}>
      {children}
      {(loadError || Object.keys(failures).length > 0) && (
        <section aria-label="My List notifications" className="fixed inset-x-4 bottom-4 z-[60] max-h-[50dvh] space-y-3 overflow-y-auto sm:left-auto sm:w-96">
          {loadError && (
            <div className="rounded-xl border border-amber-400/30 bg-[#171719] p-4 shadow-2xl">
              <p role="alert" className="text-sm text-amber-100">{loadError}</p>
              <button type="button" onClick={() => { setLoadError(null); setLoadAttempt((attempt) => attempt + 1); }} className="mt-3 min-h-11 rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-white/85">Retry loading My List</button>
            </div>
          )}
          {Object.entries(failures).map(([key, failure]) => (
            <div key={key} className="rounded-xl border border-red-400/30 bg-[#171719] p-4 shadow-2xl">
              <p role="alert" className="text-sm text-red-100">Could not {failure.saved ? "save" : "remove"} “{mediaTitle(failure.media)}”. {failure.message}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" onClick={() => { void save(failure.media, failure.saved); }} className="min-h-11 rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-white/85">Retry</button>
                <button type="button" onClick={() => clearFailure(key)} className="min-h-11 rounded-md border border-white/20 px-4 text-sm text-white/80 hover:text-white">Dismiss</button>
              </div>
            </div>
          ))}
        </section>
      )}
    </ListContext.Provider>
  );
}

export function useMyList() {
  const value = useContext(ListContext);
  if (!value) throw new Error("useMyList must be used inside WatchlistProvider");
  return value;
}
