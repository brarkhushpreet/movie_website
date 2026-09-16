"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { AuthBackdrop } from "@/components/AuthBackdrop";
import { useAuth } from "@/components/AppProviders";

export default function LoginPage() {
  const { login, ready, user, profile } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(profile ? "/browse" : "/profiles");
  }, [profile, ready, router, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Your password must be at least 6 characters.");
    setPending(true);
    try {
      await login(email, password);
      router.push("/profiles");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in right now.");
      setPending(false);
    }
  }

  function useDemo() {
    setEmail("demo@vanta.tv");
    setPassword("watchnow");
    setError("");
  }

  return (
    <AuthBackdrop>
      <section className="w-full max-w-[430px] animate-rise rounded-2xl border border-white/10 bg-black/75 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-vanta-red">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-white/50">Your next great story is waiting.</p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="h-14 w-full rounded-lg border border-white/15 bg-white/[.07] px-4 text-[15px] text-white placeholder:text-white/35 transition focus:border-vanta-red/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-vanta-red/10"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="h-14 w-full rounded-lg border border-white/15 bg-white/[.07] px-4 pr-12 text-[15px] text-white placeholder:text-white/35 transition focus:border-vanta-red/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-vanta-red/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </label>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={pending} className="group flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-vanta-red font-bold text-white transition hover:bg-[#f6121d] active:scale-[.99] disabled:cursor-wait disabled:opacity-65">
            {pending ? "Signing in…" : "Sign in"} {!pending && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="my-7 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-white/25">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>

        <button type="button" onClick={useDemo} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[.04] text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[.08] hover:text-white">
          <LockKeyhole size={16} /> Fill demo account
        </button>

        <p className="mt-7 text-sm text-white/45">
          New to Movie Explorer? <Link href="/signup" className="font-semibold text-white transition hover:text-vanta-red">Create an account</Link>
        </p>
        <p className="mt-4 text-[11px] leading-relaxed text-white/25">Sessions are secured with an HTTP-only cookie and passwords are salted before storage. Do not reuse a real password in a demo project.</p>
      </section>
    </AuthBackdrop>
  );
}
