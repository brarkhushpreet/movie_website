"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useAuth } from "./AppProviders";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/browse", label: "Home" },
  { href: "/series", label: "Series" },
  { href: "/movies", label: "Movies" },
  { href: "/new", label: "New & Popular" },
  { href: "/my-list", label: "My List" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(pathname.startsWith("/search"));
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search/${encodeURIComponent(query.trim())}`);
  }

  function openSearch() {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  async function signOut() {
    await logout();
    router.push("/login");
  }

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 h-[var(--header-height)] transition-all duration-500", scrolled ? "bg-[#070708]/95 shadow-[0_12px_40px_rgba(0,0,0,.28)] backdrop-blur-xl" : "bg-gradient-to-b from-black/85 to-transparent")}>
      <div className="mx-auto flex h-full max-w-[1800px] items-center gap-6 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <button type="button" onClick={() => setMobileOpen((value) => !value)} className="text-white/80 lg:hidden" aria-label="Toggle menu">
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <BrandLogo />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/browse" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn("relative py-2 text-[13px] font-medium text-white/65 transition hover:text-white", active && "text-white")}>
                {item.label}
                {active && <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-4 rounded-full bg-vanta-red" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <form onSubmit={submitSearch} className={cn("flex h-9 items-center overflow-hidden rounded-md transition-all duration-300 focus-within:border-vanta-red/75 focus-within:shadow-[0_0_0_3px_rgba(229,9,20,.12)]", searchOpen ? "w-40 border border-white/20 bg-black/75 sm:w-64" : "w-9")}>
            <button type="button" onClick={searchOpen ? () => searchRef.current?.focus() : openSearch} className="grid h-9 w-9 shrink-0 place-items-center text-white/85" aria-label="Search">
              <Search size={20} />
            </button>
            {searchOpen && (
              <>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && query.trim()) {
                      event.preventDefault();
                      router.push(`/search/${encodeURIComponent(query.trim())}`);
                    }
                  }}
                  placeholder="Titles, people, genres"
                  aria-label="Search titles"
                  className="min-w-0 flex-1 bg-transparent pr-2 text-xs text-white placeholder:text-white/35 focus:outline-none focus-visible:outline-none"
                />
                <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="pr-2 text-white/40 hover:text-white" aria-label="Close search"><X size={15} /></button>
              </>
            )}
          </form>

          <div className="relative hidden sm:block">
            <button type="button" onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }} className="relative grid h-9 w-9 place-items-center text-white/80 transition hover:text-white" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-vanta-red ring-2 ring-black" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-xl border border-white/10 bg-[#151517]/98 p-3 shadow-2xl backdrop-blur-xl">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[.18em] text-white/35">New for you</p>
                <Link href="/new" onClick={() => setNotificationsOpen(false)} className="flex gap-3 rounded-lg p-2 transition hover:bg-white/[.06]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-vanta-red/15 text-lg">✦</span>
                  <span><strong className="block text-xs">Your weekly drop is here</strong><span className="mt-1 block text-[11px] text-white/40">Fresh premieres picked for your profile.</span></span>
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }} className="flex items-center gap-1.5" aria-label="Profile menu" aria-expanded={profileOpen}>
              <span className={cn("grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br text-sm font-bold shadow-lg", profile?.gradient || "from-red-600 to-orange-400")}>{profile?.initials || "V"}</span>
              <ChevronDown size={14} className={cn("hidden text-white/60 transition sm:block", profileOpen && "rotate-180")} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#151517]/98 p-2 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/8 px-3 py-2.5">
                  <p className="text-sm font-semibold">{profile?.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-emerald-400">Active profile</p>
                </div>
                <Link href="/profiles" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-md px-3 py-2 text-xs text-white/65 hover:bg-white/[.06] hover:text-white">Switch profiles</Link>
                <Link href="/account" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-xs text-white/65 hover:bg-white/[.06] hover:text-white">Account settings</Link>
                <button type="button" onClick={signOut} className="w-full rounded-md px-3 py-2 text-left text-xs text-white/65 hover:bg-white/[.06] hover:text-white">Sign out of Movie Explorer</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="absolute left-4 right-4 top-[68px] rounded-xl border border-white/10 bg-[#101012]/98 p-2 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("block rounded-lg px-4 py-3 text-sm text-white/60 hover:bg-white/[.06] hover:text-white", pathname === item.href && "bg-white/[.07] font-semibold text-white")}>{item.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
