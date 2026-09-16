import type { Metadata } from "next";
import Link from "next/link";
import { MediaGrid } from "@/components/MediaGrid";
import { discoverGenre } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ genre?: string; type?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { genre } = await searchParams;
  return { title: genre || "Genre" };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const type: MediaType = query.type === "tv" ? "tv" : "movie";
  const genre = query.genre ? decodeURIComponent(query.genre) : "Genre";
  const items = await discoverGenre(id, type);

  return (
    <main className="mx-auto min-h-[75vh] max-w-[1600px] px-5 pb-16 pt-32 sm:px-8 lg:px-12">
      <div className="mb-10 flex flex-col gap-6 border-b border-white/[.07] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-vanta-red">Explore a mood</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">{genre}</h1>
          <p className="mt-2 text-sm text-white/35">Handpicked from what&apos;s popular now</p>
        </div>
        <div className="flex rounded-lg border border-white/10 bg-white/[.03] p-1">
          {(["movie", "tv"] as const).map((option) => (
            <Link key={option} href={`/genre/${id}?genre=${encodeURIComponent(genre)}&type=${option}`} className={cn("rounded-md px-4 py-2 text-xs font-semibold capitalize text-white/45 transition", type === option && "bg-white text-black")}>{option === "tv" ? "Series" : "Movies"}</Link>
          ))}
        </div>
      </div>
      <MediaGrid items={items} />
    </main>
  );
}
