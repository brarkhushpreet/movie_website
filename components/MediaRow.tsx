"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { MediaCard } from "./MediaCard";

export function MediaRow({ title, eyebrow, items, ranked = false }: { title: string; eyebrow?: string; items: MediaItem[]; ranked?: boolean }) {
  const row = useRef<HTMLDivElement>(null);

  function move(direction: 1 | -1) {
    row.current?.scrollBy({ left: direction * Math.max(300, row.current.clientWidth * 0.78), behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <section className="group/row relative py-4 sm:py-5">
      <div className="mb-3 flex items-end justify-between px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div>
          {eyebrow && <p className="mb-1 text-[9px] font-bold uppercase tracking-[.2em] text-vanta-red sm:text-[10px]">{eyebrow}</p>}
          <h2 className="font-display text-lg font-bold tracking-tight sm:text-xl lg:text-[22px]">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.04] text-white/70 transition hover:border-white/40 hover:text-white" aria-label={`Scroll ${title} left`}><ChevronLeft size={17} /></button>
          <button type="button" onClick={() => move(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.04] text-white/70 transition hover:border-white/40 hover:text-white" aria-label={`Scroll ${title} right`}><ChevronRight size={17} /></button>
        </div>
      </div>
      <div ref={row} className="no-scrollbar flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-5 pt-2 sm:scroll-px-10 sm:gap-4 sm:px-10 lg:scroll-px-16 lg:px-16 xl:scroll-px-20 xl:px-20 2xl:scroll-px-24 2xl:px-24">
        {items.map((media, index) => (
          <div key={`${media.media_type}-${media.id}-${index}`} className={`shrink-0 snap-start ${ranked ? "" : "w-[220px] sm:w-[280px] lg:w-[310px]"}`}>
            <MediaCard media={media} rank={ranked ? index + 1 : undefined} priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
