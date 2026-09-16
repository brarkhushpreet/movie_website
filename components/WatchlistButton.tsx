"use client";

import { Check, LoaderCircle, Plus } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { useMyList } from "./AppProviders";
import { cn } from "@/lib/utils";
import { mediaTitle } from "@/lib/media";

export function WatchlistButton({ media, label = false, className }: { media: MediaItem; label?: boolean; className?: string }) {
  const { has, toggle, ready, isPending } = useMyList();
  const saved = has(media);
  const pending = isPending(media);
  const action = pending ? "Saving" : saved ? "Remove from My List" : "Add to My List";

  return (
    <button
      type="button"
      onClick={() => toggle(media)}
      disabled={!ready || pending}
      aria-label={`${action}: ${mediaTitle(media)}`}
      aria-pressed={saved}
      aria-busy={pending}
      title={action}
      className={cn("inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-black/30 text-white transition hover:border-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-50", label ? "h-12 px-5 text-sm font-bold" : "h-11 w-11", className)}
    >
      {pending ? <LoaderCircle size={label ? 19 : 17} className="animate-spin" /> : saved ? <Check size={label ? 19 : 17} /> : <Plus size={label ? 19 : 17} />}
      {label && <span>{pending ? "Saving…" : saved ? "In My List" : "My List"}</span>}
    </button>
  );
}
