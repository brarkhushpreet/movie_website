"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { imageUrl, mediaRating, mediaTitle, mediaType, mediaYear } from "@/lib/media";
import { WatchlistButton } from "./WatchlistButton";
import { cn } from "@/lib/utils";

export function MediaCard({ media, rank, priority = false }: { media: MediaItem; rank?: number; priority?: boolean }) {
  const type = mediaType(media);
  const title = mediaTitle(media);
  const href = `/title/${type}/${media.id}`;

  if (rank) {
    return (
      <article className="group relative flex min-w-[250px] items-end sm:min-w-[310px]">
        <span aria-hidden className="-mr-3 select-none font-display text-[9rem] font-black leading-[.72] tracking-[-.09em] text-[#09090a] [-webkit-text-stroke:2px_rgba(255,255,255,.38)] sm:text-[11rem]">{rank}</span>
        <Link href={href} className="relative mb-1 block aspect-[2/3] w-28 overflow-hidden rounded-md bg-[#171719] shadow-xl transition duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03] sm:w-36">
          <Image src={imageUrl(media.poster_path || media.backdrop_path, "w500")} alt={title} fill sizes="144px" className="object-cover transition duration-500 group-hover:scale-105" priority={priority} />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
          <span className="absolute bottom-2 left-2 right-2 line-clamp-2 text-xs font-bold text-white sm:hidden">{title}</span>
        </Link>
      </article>
    );
  }

  return (
    <article className="group relative min-w-0 rounded-md bg-[#171719] shadow-lg">
      <Link href={href} aria-label={`Details for ${title}`} className="relative block aspect-video overflow-hidden rounded-t-md transition duration-300 group-hover:shadow-2xl group-focus-within:ring-1 group-focus-within:ring-white/30">
        <Image src={imageUrl(media.backdrop_path || media.poster_path, "w780")} alt={title} fill sizes="(max-width: 640px) 220px, 310px" className="object-cover transition duration-500 group-hover:scale-105" priority={priority} />
        <span className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/5 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 translate-y-1 p-3 transition duration-300 group-hover:translate-y-0 sm:p-4">
          <span className="block truncate text-sm font-bold drop-shadow-md">{title}</span>
          <span className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-white/65">
            <span className="text-emerald-400">{mediaRating(media)}</span>
            <span>{mediaYear(media)}</span>
          </span>
        </span>
        <span className={cn("absolute left-2 top-2 rounded-sm px-1.5 py-1 text-[8px] font-black uppercase tracking-wider", media.vote_average >= 8 ? "bg-vanta-red" : "bg-black/55 backdrop-blur-sm")}>
          {media.vote_average >= 8 ? "Highly rated" : type === "tv" ? "Series" : "Film"}
        </span>
      </Link>
      <div className="flex items-center gap-2 p-3">
        <Link href={`/watch/${type}/${media.id}`} aria-label={`View trailer for ${title}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-3 text-xs font-bold text-black transition hover:bg-white/85"><Play size={14} fill="currentColor" /> Trailer</Link>
        <div className="ml-auto"><WatchlistButton media={media} /></div>
      </div>
    </article>
  );
}
