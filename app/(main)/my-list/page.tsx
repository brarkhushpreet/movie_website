"use client";

import Link from "next/link";
import { Bookmark, Plus } from "lucide-react";
import { MediaGrid } from "@/components/MediaGrid";
import { useMyList } from "@/components/AppProviders";

export default function MyListPage() {
  const { items, ready, loadError } = useMyList();

  return (
    <main className="mx-auto min-h-[76vh] max-w-[1800px] px-6 pb-16 pt-32 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
      <div className="mb-10 border-b border-white/[.07] pb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-vanta-red">Saved for later</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">My List</h1>
        <p className="mt-2 text-sm text-white/35">Your personal shelf. Pick up whenever the mood hits.</p>
      </div>
      {loadError ? (
        <p className="py-16 text-center text-white/70">Your list is temporarily unavailable. Use “Retry loading My List” to try again.</p>
      ) : !ready ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton aspect-video rounded-md" />)}</div>
      ) : items.length ? (
        <MediaGrid items={items} />
      ) : (
        <div className="grid place-items-center py-24 text-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[.03]"><Bookmark size={27} className="text-white/35" /><Plus size={14} className="absolute bottom-3 right-3 rounded-full bg-vanta-red" /></span>
          <h2 className="mt-5 font-display text-2xl font-bold">Your list is ready for a first pick</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">Tap the plus on any title and it&apos;ll wait for you here.</p>
          <Link href="/browse" className="mt-6 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-white/85">Find something great</Link>
        </div>
      )}
    </main>
  );
}
