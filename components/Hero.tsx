import Image from "next/image";
import Link from "next/link";
import { Info, Play, Sparkles } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { imageUrl, mediaRating, mediaTitle, mediaType, mediaYear, truncate } from "@/lib/media";
import { WatchlistButton } from "./WatchlistButton";

export function Hero({ media, context = "Tonight's spotlight" }: { media: MediaItem; context?: string }) {
  const type = mediaType(media);
  const title = mediaTitle(media);

  return (
    <section className="cinema-grain relative isolate min-h-[690px] overflow-hidden sm:min-h-[760px] lg:min-h-[790px]">
      <Image src={imageUrl(media.backdrop_path, "original")} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center sm:object-[65%_center]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#070708_2%,rgba(7,7,8,.88)_27%,rgba(7,7,8,.24)_67%,rgba(7,7,8,.14)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,7,8,.25)_0%,transparent_38%,#070708_97%)]" />
      <div className="mx-auto flex min-h-[690px] max-w-[1800px] items-end px-6 pb-28 pt-32 sm:min-h-[760px] sm:px-10 sm:pb-36 lg:min-h-[790px] lg:items-center lg:px-16 lg:pb-28 lg:pt-28 xl:px-20 2xl:px-24">
        <div className="max-w-2xl animate-rise">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white/70 backdrop-blur-md">
            <Sparkles size={12} className="text-vanta-red" /> {context}
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-7 w-6 place-items-center rounded bg-vanta-red font-display text-xs font-black">V</span>
            <span className="text-[10px] font-bold uppercase tracking-[.34em] text-white/55">Movie Explorer pick</span>
          </div>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-[.98] tracking-[-.045em] drop-shadow-2xl sm:text-6xl lg:text-7xl">{title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold sm:text-sm">
            <span className="text-emerald-400">{mediaRating(media)}</span>
            <span className="text-white/70">{mediaYear(media)}</span>
            <span className="capitalize text-white/45">{type === "tv" ? "Series" : "Film"}</span>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/72 drop-shadow-md sm:text-base sm:leading-7">{truncate(media.overview || "A story made for the hours when everything else goes quiet.", 215)}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/watch/${type}/${media.id}`} className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-black transition hover:bg-white/80 sm:px-7"><Play size={20} fill="currentColor" /> View trailer</Link>
            <Link href={`/title/${type}/${media.id}`} className="inline-flex h-12 items-center gap-2 rounded-md bg-white/17 px-5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25 sm:px-6"><Info size={20} /> More info</Link>
            <WatchlistButton media={media} className="h-12 w-12 bg-black/30" />
          </div>
          <div className="mt-7 flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/35">
            Movie and series discovery · Official trailers
          </div>
        </div>
      </div>
    </section>
  );
}
