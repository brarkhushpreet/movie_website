"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, CreditCard, LogOut, MonitorPlay, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AppProviders";

export default function AccountPage() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [autoplay, setAutoplay] = useState(true);
  const [previews, setPreviews] = useState(true);
  const [emails, setEmails] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    const controller = new AbortController();
    fetch(`/api/preferences?profileId=${encodeURIComponent(profile.id)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load preferences");
        return response.json() as Promise<{ preferences: { autoplay: boolean; previews: boolean; emails: boolean } }>;
      })
      .then(({ preferences }) => {
        setAutoplay(preferences.autoplay);
        setPreviews(preferences.previews);
        setEmails(preferences.emails);
      })
      .catch((caught: unknown) => {
        if (!(caught instanceof DOMException && caught.name === "AbortError")) setError("Your preferences could not be loaded.");
      });
    return () => controller.abort();
  }, [profile]);

  async function save() {
    if (!profile) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, autoplay, previews, emails }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Unable to save preferences");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save preferences.");
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    await logout();
    router.push("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <div className="mb-10 flex flex-col gap-3 border-b border-white/[.08] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-vanta-red">Member space</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Account</h1>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400"><ShieldCheck size={13} /> Protected member</span>
      </div>

      <div className="space-y-5">
        <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025]">
          <div className="flex items-start gap-4 border-b border-white/[.07] p-6">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${profile?.gradient} text-lg font-bold`}>{profile?.initials}</span>
            <div className="min-w-0"><h2 className="font-display text-lg font-bold">{user?.name}</h2><p className="truncate text-sm text-white/40">{user?.email}</p></div>
            <Link href="/profiles" className="ml-auto flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white">Switch <ChevronRight size={15} /></Link>
          </div>
          <div className="grid gap-px bg-white/[.06] sm:grid-cols-3">
            {[
              { icon: UserRound, label: "Profile", value: profile?.name || "Member" },
              { icon: CreditCard, label: "Plan", value: "Portfolio demo" },
              { icon: MonitorPlay, label: "Playback", value: "Official trailers on YouTube" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-[#0d0d0f] p-5"><item.icon size={18} className="text-vanta-red" /><span><span className="block text-[9px] uppercase tracking-[.16em] text-white/30">{item.label}</span><strong className="mt-0.5 block text-xs text-white/75">{item.value}</strong></span></div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-6 sm:p-7">
          <div className="mb-5"><h2 className="font-display text-lg font-bold">Playback preferences</h2><p className="mt-1 text-xs text-white/35">These settings follow this profile on every device.</p></div>
          <div className="divide-y divide-white/[.07]">
            {[
              { label: "Autoplay title trailers", description: "Start official trailers when the player opens.", value: autoplay, setter: setAutoplay },
              { label: "Start previews muted", description: "Keep trailer audio off until you turn it on.", value: previews, setter: setPreviews },
              { label: "Show captions by default", description: "Request English captions when the trailer provides them.", value: emails, setter: setEmails },
            ].map((setting) => (
              <label key={setting.label} className="flex cursor-pointer items-center gap-5 py-4">
                <span className="min-w-0 flex-1"><strong className="block text-sm text-white/80">{setting.label}</strong><span className="mt-1 block text-xs text-white/35">{setting.description}</span></span>
                <input type="checkbox" checked={setting.value} onChange={(event) => setting.setter(event.target.checked)} className="peer sr-only" />
                <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition peer-checked:bg-vanta-red"><span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" /></span>
              </label>
            ))}
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
          <button type="button" onClick={save} disabled={pending} className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-bold text-black transition hover:bg-white/85 disabled:cursor-wait disabled:opacity-60">{saved ? <><Check size={17} /> Saved</> : pending ? "Saving…" : "Save preferences"}</button>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-red-500/15 bg-red-500/[.035] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-bold">Sign out on this device</h2><p className="mt-1 text-xs text-white/35">Profiles, preferences, and My List stay safely stored.</p></div>
          <button type="button" onClick={signOut} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white"><LogOut size={15} /> Sign out</button>
        </section>
      </div>
    </main>
  );
}
