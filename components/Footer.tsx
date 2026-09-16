import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

const links = [
  { label: "Browse", href: "/browse" },
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/series" },
  { label: "New & Popular", href: "/new" },
  { label: "My List", href: "/my-list" },
  { label: "Account & playback", href: "/account" },
];

export function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-6 pb-10 pt-12 text-white/35 lg:px-10">
      <div className="mb-8 flex items-center justify-between border-b border-white/[.07] pb-7">
        <BrandLogo compact />
        <a href="https://khushpreet.dev" className="text-xs transition hover:text-white">Built by Khushpreet</a>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-xs sm:grid-cols-4">
        {links.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-white hover:underline">{link.label}</Link>)}
      </div>
      <p className="mt-9 max-w-2xl text-[10px] leading-relaxed text-white/20">This product is a portfolio demo and is not affiliated with Netflix. Movie and TV metadata is supplied by TMDB. Trailers remain the property of their respective owners.</p>
      <p className="mt-4 text-[10px] uppercase tracking-[.18em] text-white/20">© 2026 Movie Explorer · Stories after dark</p>
    </footer>
  );
}
