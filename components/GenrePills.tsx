import Link from "next/link";
import type { Genre } from "@/lib/types";

export function GenrePills({ genres }: { genres: Genre[] }) {
  return (
    <section className="px-6 py-8 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold sm:text-xl">Pick a mood</h2>
        <span className="text-[10px] uppercase tracking-[.16em] text-white/30">Explore by genre</span>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {genres.slice(0, 12).map((genre) => (
          <Link key={genre.id} href={`/genre/${genre.id}?genre=${encodeURIComponent(genre.name)}`} className="shrink-0 rounded-full border border-white/12 bg-white/[.035] px-4 py-2 text-xs font-medium text-white/55 transition hover:border-vanta-red/50 hover:bg-vanta-red/10 hover:text-white">
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
