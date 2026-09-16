"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Film } from "lucide-react";
import type { MediaDetails, MediaType } from "@/lib/types";
import type { PlaybackPreferences } from "@/lib/member-types";
import { imageUrl, mediaTitle } from "@/lib/media";
import { useAuth } from "@/components/AppProviders";

const defaultPreferences: PlaybackPreferences = { autoplay: false, previews: true, emails: false };

function TrailerEmbed({ trailerKey, title, profileId }: { trailerKey: string; title: string; profileId?: string }) {
  const [preferences, setPreferences] = useState<PlaybackPreferences | null>(profileId ? null : defaultPreferences);
  const [preferencesFailed, setPreferencesFailed] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    let active = true;

    fetch(`/api/preferences?profileId=${encodeURIComponent(profileId)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load playback preferences");
        return response.json() as Promise<{ preferences: PlaybackPreferences }>;
      })
      .then((payload) => {
        if (active) setPreferences(payload.preferences);
      })
      .catch(() => {
        if (active) {
          setPreferences(defaultPreferences);
          setPreferencesFailed(true);
        }
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [profileId]);

  const params = new URLSearchParams({
    controls: "1",
    fs: "1",
    playsinline: "1",
    rel: "0",
    autoplay: preferences?.autoplay ? "1" : "0",
    mute: preferences?.previews ? "1" : "0",
    cc_lang_pref: "en",
  });
  if (preferences?.emails) params.set("cc_load_policy", "1");

  return (
    <div className="w-full max-w-6xl">
      {preferences ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailerKey)}?${params}`}
          title={`${title} official trailer`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video min-h-[200px] w-full rounded-lg border-0 bg-black"
        />
      ) : (
        <div role="status" className="grid aspect-video min-h-[200px] place-items-center rounded-lg bg-white/[.04] text-sm text-white/60">Loading trailer…</div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
        <p>Official trailer · Use the player controls to pause, seek, or change playback settings.</p>
        <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailerKey)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-white">Watch on YouTube <ExternalLink size={14} /></a>
      </div>
      {preferencesFailed && <p role="status" className="mt-2 text-xs text-amber-200">Your playback preferences could not be loaded. The trailer will start muted when you press play.</p>}
    </div>
  );
}

export function TrailerPlayer({ media, type, trailerKey }: { media: MediaDetails; type: MediaType; trailerKey?: string }) {
  const { profile } = useAuth();
  const title = mediaTitle(media);

  return (
    <main className="flex min-h-dvh flex-col bg-black">
      <div className="flex items-center gap-4 p-5 sm:p-8">
        <Link href={`/title/${type}/${media.id}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black" aria-label="Back to title"><ArrowLeft size={23} /></Link>
        <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/50">Official trailer</p><h1 className="mt-0.5 font-display text-lg font-bold sm:text-xl">{title}</h1></div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-8">
        {trailerKey ? (
          <TrailerEmbed key={`${profile?.id}:${trailerKey}`} trailerKey={trailerKey} title={title} profileId={profile?.id} />
        ) : (
          <section className="relative grid min-h-[360px] w-full max-w-6xl place-items-center overflow-hidden rounded-lg p-6 text-center">
            <Image src={imageUrl(media.backdrop_path || media.poster_path, "original")} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
            <div className="relative max-w-md"><Film size={32} className="mx-auto text-white/60" /><h2 className="mt-4 text-xl font-bold">No trailer available</h2><p className="mt-2 text-sm leading-6 text-white/70">There is no official trailer available for this title. You can still explore its details and related titles.</p><Link href={`/title/${type}/${media.id}`} className="mt-5 inline-flex min-h-11 items-center rounded-md bg-white px-5 text-sm font-bold text-black hover:bg-white/85">Back to title</Link></div>
          </section>
        )}
      </div>
    </main>
  );
}
