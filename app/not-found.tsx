import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#1e1e23_0%,#070708_58%)] p-6 text-center">
      <div className="relative max-w-lg">
        <span className="absolute -left-16 -top-24 select-none font-display text-[12rem] font-black leading-none text-white/[.025]">404</span>
        <BrandLogo />
        <Film size={44} strokeWidth={1.2} className="mx-auto mt-12 text-vanta-red" />
        <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">This title left the catalog.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">The page you&apos;re looking for doesn&apos;t exist, but there&apos;s always another great story waiting.</p>
        <Link href="/browse" className="mx-auto mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-black transition hover:bg-white/85"><ArrowLeft size={17} /> Back to browse</Link>
      </div>
    </main>
  );
}
