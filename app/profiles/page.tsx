"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth, type Profile } from "@/components/AppProviders";

type Editor = Profile | "new" | null;

export default function ProfilesPage() {
  const { ready, user, profiles, selectProfile, addProfile, updateProfile, deleteProfile } = useAuth();
  const router = useRouter();
  const [managing, setManaging] = useState(false);
  const [editor, setEditor] = useState<Editor>(null);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, router, user]);

  function choose(profile: Profile) {
    if (managing) {
      openEditor(profile);
      return;
    }
    selectProfile(profile);
    router.push("/browse");
  }

  function openEditor(next: Profile | "new") {
    setEditor(next);
    setName(next === "new" ? "" : next.name);
    setError("");
    setConfirmDelete(false);
  }

  function closeEditor() {
    if (pending) return;
    setEditor(null);
    setError("");
    setConfirmDelete(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) return setError("Profile name must be at least 2 characters.");
    setPending(true);
    setError("");
    try {
      if (editor === "new") await addProfile(cleanName, false);
      else if (editor) await updateProfile(editor.id, cleanName, editor.kids);
      setEditor(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save this profile.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!editor || editor === "new") return;
    setPending(true);
    setError("");
    try {
      await deleteProfile(editor.id);
      setEditor(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete this profile.");
      setConfirmDelete(false);
    } finally {
      setPending(false);
    }
  }

  if (!ready || !user) return <div className="min-h-screen bg-vanta-ink" />;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#17171b_0%,#070708_58%)] px-5 py-7 sm:px-10">
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-vanta-red/[.035] blur-3xl" />
      <BrandLogo />
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center py-14 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-vanta-red">Welcome, {user.name}</p>
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">{managing ? "Manage profiles" : "Who’s watching?"}</h1>
        <p className="mt-3 text-sm text-white/40">{managing ? "Select a profile to edit its name." : "Choose a profile for your saved titles and playback preferences."}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-5 sm:gap-8">
          {profiles.map((item) => (
            <button key={item.id} type="button" onClick={() => choose(item)} className="group w-24 sm:w-32" aria-label={managing ? `Edit ${item.name}` : `Continue as ${item.name}`}>
              <span className={`relative grid aspect-square place-items-center overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-br ${item.gradient} text-4xl font-bold text-white shadow-xl transition duration-300 group-hover:scale-[1.04] group-hover:border-white sm:text-5xl`}>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.35),transparent_35%)]" />
                <span className="relative">{item.initials}</span>
                {managing && <span className="absolute inset-0 grid place-items-center bg-black/60"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/40"><Pencil size={22} /></span></span>}
              </span>
              <span className="mt-3 block truncate text-sm text-white/45 transition group-hover:text-white sm:text-base">{item.name}</span>
            </button>
          ))}
          {profiles.length < 5 && (
            <button type="button" onClick={() => openEditor("new")} className="group w-24 sm:w-32">
              <span className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-white/15 bg-white/[.025] text-white/35 transition group-hover:border-white/60 group-hover:bg-white/[.06] group-hover:text-white">
                <Plus size={38} strokeWidth={1.4} />
              </span>
              <span className="mt-3 block text-sm text-white/45 group-hover:text-white sm:text-base">Add profile</span>
            </button>
          )}
        </div>

        <button type="button" onClick={() => setManaging((value) => !value)} className="mt-12 rounded-md border border-white/25 px-6 py-2.5 text-xs font-semibold uppercase tracking-[.16em] text-white/55 transition hover:border-white hover:text-white">
          {managing ? "Done" : "Manage profiles"}
        </button>
      </section>

      {editor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5 backdrop-blur-md" onMouseDown={closeEditor}>
          <form onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#171719] p-7 text-left shadow-[0_30px_100px_rgba(0,0,0,.75)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vanta-red/70 to-transparent" />
            <button type="button" onClick={closeEditor} disabled={pending} className="absolute right-5 top-5 text-white/40 transition hover:text-white" aria-label="Close"><X size={21} /></button>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-vanta-red">{editor === "new" ? "New space" : "Profile controls"}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{editor === "new" ? "Add a profile" : `Edit ${editor.name}`}</h2>
            <p className="mt-1 text-sm text-white/45">Saved titles and playback preferences stay with this profile. All profiles browse the same catalog.</p>

            <div className="mt-7 flex items-center gap-4">
              <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${editor === "new" ? "from-vanta-red to-orange-500" : editor.gradient} text-2xl font-bold shadow-lg`}>{name.trim().slice(0, 1).toUpperCase() || "+"}</span>
              <label className="min-w-0 flex-1">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">Profile name</span>
                <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Profile name" maxLength={18} className="h-12 w-full rounded-lg border border-white/15 bg-black/30 px-4 focus:border-vanta-red/70 focus:outline-none focus:ring-4 focus:ring-vanta-red/10" />
              </label>
            </div>

            {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              {editor !== "new" && (
                confirmDelete ? (
                  <div className="flex items-center gap-2 sm:mr-auto">
                    <button type="button" onClick={() => setConfirmDelete(false)} disabled={pending} className="h-10 rounded-md border border-white/15 px-3 text-xs text-white/55 hover:text-white">Cancel</button>
                    <button type="button" onClick={remove} disabled={pending} className="h-10 rounded-md bg-red-600 px-3 text-xs font-bold hover:bg-red-500 disabled:opacity-50">{pending ? "Deleting…" : "Confirm delete"}</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} disabled={pending} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-500/20 px-3 text-xs text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10 sm:mr-auto"><Trash2 size={14} /> Delete</button>
                )
              )}
              <button type="button" onClick={closeEditor} disabled={pending} className="h-11 rounded-md border border-white/15 px-5 text-sm font-semibold text-white/60 hover:text-white">Cancel</button>
              <button type="submit" disabled={pending || name.trim().length < 2} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-bold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"><Save size={16} /> {pending ? "Saving…" : "Save profile"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
