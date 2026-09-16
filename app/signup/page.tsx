"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { AuthBackdrop } from "@/components/AuthBackdrop";
import { useAuth } from "@/components/AppProviders";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Tell us what to call you.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Choose a password with at least 8 characters.");
    setPending(true);
    try {
      await signup(name.trim(), email, password);
      router.push("/profiles");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create your account right now.");
      setPending(false);
    }
  }

  return (
    <AuthBackdrop>
      <section className="w-full max-w-[470px] animate-rise rounded-2xl border border-white/10 bg-black/75 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-vanta-red">Membership · free demo</p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Start watching.</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">Create your Movie Explorer space. No payment details needed for this demo.</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          {[
            { label: "Your name", value: name, setter: setName, type: "text", autoComplete: "name" },
            { label: "Email address", value: email, setter: setEmail, type: "email", autoComplete: "email" },
          ].map((field) => (
            <label key={field.label} className="block">
              <span className="sr-only">{field.label}</span>
              <input
                type={field.type}
                value={field.value}
                onChange={(event) => field.setter(event.target.value)}
                autoComplete={field.autoComplete}
                placeholder={field.label}
                className="h-14 w-full rounded-lg border border-white/15 bg-white/[.07] px-4 text-[15px] placeholder:text-white/35 focus:border-vanta-red/70 focus:outline-none focus:ring-4 focus:ring-vanta-red/10"
              />
            </label>
          ))}
          <label className="relative block">
            <span className="sr-only">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Create password"
              className="h-14 w-full rounded-lg border border-white/15 bg-white/[.07] px-4 pr-12 text-[15px] placeholder:text-white/35 focus:border-vanta-red/70 focus:outline-none focus:ring-4 focus:ring-vanta-red/10"
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Up to 5 profiles</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Personal My List</span>
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={pending} className="group flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-vanta-red font-bold transition hover:bg-[#f6121d] disabled:cursor-wait disabled:opacity-65">
            {pending ? "Creating account…" : "Create account"} {!pending && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
        <p className="mt-7 text-sm text-white/45">Already a member? <Link href="/login" className="font-semibold text-white hover:text-vanta-red">Sign in</Link></p>
      </section>
    </AuthBackdrop>
  );
}
