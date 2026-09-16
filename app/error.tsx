"use client";

import { RotateCcw } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_35%,#251014_0%,#070708_55%)] p-6 text-center">
      <div className="max-w-lg">
        <BrandLogo />
        <p className="mt-12 text-xs font-bold uppercase tracking-[.22em] text-vanta-red">A brief intermission</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">The reel slipped.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">Something unexpected interrupted this scene. Try it once more and we&apos;ll pick up where you left off.</p>
        <button type="button" onClick={retry} className="mx-auto mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-black transition hover:bg-white/85"><RotateCcw size={17} /> Try again</button>
        {error.digest && <p className="mt-5 text-[10px] text-white/20">Reference {error.digest}</p>}
      </div>
    </main>
  );
}
