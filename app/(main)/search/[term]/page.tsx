import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { MediaGrid } from "@/components/MediaGrid";
import { searchMedia } from "@/lib/tmdb";

type Props = { params: Promise<{ term: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  return { title: `Search: ${decodeURIComponent(term)}` };
}

export default async function SearchPage({ params }: Props) {
  const { term } = await params;
  const query = decodeURIComponent(term);
  const items = await searchMedia(query);

  return (
    <main className="mx-auto min-h-[75vh] max-w-[1600px] px-5 pb-16 pt-32 sm:px-8 lg:px-12">
      <div className="mb-10 border-b border-white/[.07] pb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-vanta-red">Search results</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">“{query}”</h1>
        <p className="mt-2 text-sm text-white/35">{items.length} {items.length === 1 ? "title" : "titles"} found</p>
      </div>
      {items.length ? (
        <MediaGrid items={items} />
      ) : (
        <div className="grid place-items-center py-24 text-center">
          <SearchX size={44} strokeWidth={1.25} className="text-white/20" />
          <h2 className="mt-5 font-display text-2xl font-bold">No matches in tonight&apos;s catalog</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">Try a title, actor, director, or a broader genre.</p>
          <Link href="/browse" className="mt-6 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-white/85">Back to browse</Link>
        </div>
      )}
    </main>
  );
}
