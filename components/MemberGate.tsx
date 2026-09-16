"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AppProviders";

export function MemberGate({ children }: { children: React.ReactNode }) {
  const { ready, user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!profile) router.replace("/profiles");
  }, [profile, ready, router, user]);

  if (!ready || !user || !profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#070708]">
        <div className="flex flex-col items-center gap-4 text-sm text-white/45">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-vanta-red" />
          Loading your cinema…
        </div>
      </div>
    );
  }

  return children;
}
