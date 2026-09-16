import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clapperboard, Clock3, Play, Sparkles, Star } from "lucide-react";
import { MediaRow } from "@/components/MediaRow";
import { WatchlistButton } from "@/components/WatchlistButton";
import { formatRuntime, imageUrl, mediaRating, mediaTitle, mediaYear } from "@/lib/media";
import { getDetails } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

type Props = { params: Promise<{ type: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  if (type !== "movie" && type !== "tv") return { title: "Title" };
  const media = await getDetails(type, id);
  return { title: media ? mediaTitle(media) : "Title not found" };
}

export default async function TitlePage({ params }: Props) {
  const { type: rawType, id } = await params;
  if (rawType !== "movie" && rawType !== "tv") notFound();
  const type = rawType as MediaType;
  const media = await getDetails(type, id);
  if (!media) notFound();

  const title = mediaTitle(media);
  const runtime = formatRuntime(media.runtime || media.episode_run_time?.[0]);
  const trailer = media.videos?.results.find((video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"));
  const recommendations = media.recommendations?.results.length ? media.recommendations.results : media.similar?.results || [];
  const cast = media.credits?.cast.slice(0, 8) || [];

  return (
    <main className="pb-10">
      <section className="cinema-grain relative min-h-[700px] overflow-hidden">
        <Image src={imageUrl(media.backdrop_path || media.poster_path, "original")} alt="" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070708_4%,rgba(7,7,8,.88)_34%,rgba(7,7,8,.2)_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-black/35" />
        <div className="relative mx-auto flex min-h-[700px] max-w-[1600px] items-end px-5 pb-16 pt-32 sm:px-8 lg:items-center lg:px-12 lg:pb-0">
          <div className="max-w-2xl animate-rise">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/45"><Clapperboard size={14} className="text-vanta-red" /> {type === "tv" ? "Movie Explorer series" : "Movie Explorer film"}</div>
            <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-.04em] sm:text-6xl lg:text-7xl">{title}</h1>
            {media.tagline && <p className="mt-3 font-display text-lg font-medium italic text-white/55">“{media.tagline}”</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/60">
              <span className="text-emerald-400">{mediaRating(media)}</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {mediaYear(media)}</span>
              {runtime && <span className="flex items-center gap-1.5"><Clock3 size={14} /> {runtime}</span>}
              {media.number_of_seasons && <span>{media.number_of_seasons} {media.number_of_seasons === 1 ? "Season" : "Seasons"}</span>}
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{media.overview}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {trailer ? <Link href={`/watch/${type}/${media.id}`} className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-7 text-sm font-bold text-black transition hover:bg-white/80"><Play size={20} fill="currentColor" /> Play trailer</Link> : <span className="inline-flex h-12 items-center text-sm text-white/60">No trailer available</span>}
              <WatchlistButton media={media} label />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.5fr_.7fr] lg:px-12">
        <div>
          <div className="mb-5 flex items-center gap-2"><Sparkles size={17} className="text-vanta-red" /><h2 className="font-display text-xl font-bold">About this title</h2></div>
          <p className="max-w-3xl text-sm leading-7 text-white/50">Explore the cast, genres, and audience rating from TMDB. Ratings reflect TMDB audience votes. Movie Explorer offers title discovery and official trailers.</p>
          {cast.length > 0 && (
            <div className="mt-9"><h3 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white/35">Cast</h3><div className="flex flex-wrap gap-2">{cast.map((person) => <span key={person.id} title={person.character} className="rounded-full border border-white/[.09] bg-white/[.035] px-3 py-2 text-xs text-white/60">{person.name}</span>)}</div></div>
          )}
        </div>
        <aside className="rounded-xl border border-white/[.08] bg-white/[.025] p-5 text-xs leading-6 text-white/45">
          <div className="mb-4 flex items-center gap-2 text-white/75"><Star size={15} fill="#e50914" className="text-vanta-red" /><strong>{mediaRating(media)}</strong></div>
          <p><span className="text-white/25">Genres: </span>{media.genres.map((genre) => genre.name).join(", ") || "Not listed"}</p>
          <p><span className="text-white/25">Status: </span>{media.status || "Not listed"}</p>
        </aside>
      </section>

      {recommendations.length > 0 && <MediaRow title="More Like This" eyebrow="Keep the mood going" items={recommendations} />}
    </main>
  );
}
