"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { MemberProfile, MemberSessionPayload, MemberUser } from "@/lib/member-types";
import { WatchlistProvider } from "./WatchlistProvider";
export { useMyList } from "./WatchlistProvider";

export type Profile = MemberProfile;

type AuthContextValue = {
  user: MemberUser | null;
  profile: Profile | null;
  profiles: Profile[];
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile | null) => void;
  addProfile: (name: string, kids: boolean) => Promise<Profile>;
  updateProfile: (id: string, name: string, kids: boolean) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SELECTED_PROFILE_KEY = "vanta:selected-profile";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    requestJson<MemberSessionPayload>("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then((payload) => {
        setUser(payload.user);
        setProfiles(payload.profiles);
        const selectedId = localStorage.getItem(SELECTED_PROFILE_KEY);
        setProfile(payload.profiles.find((item) => item.id === selectedId) || null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUser(null);
        setProfiles([]);
        setProfile(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setReady(true);
      });
    return () => controller.abort();
  }, []);

  const applySession = useCallback((payload: MemberSessionPayload) => {
    setUser(payload.user);
    setProfiles(payload.profiles);
    setProfile(null);
    localStorage.removeItem(SELECTED_PROFILE_KEY);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const payload = await requestJson<MemberSessionPayload>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    applySession(payload);
  }, [applySession]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const payload = await requestJson<MemberSessionPayload>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    applySession(payload);
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await requestJson<{ success: boolean }>("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setProfile(null);
      setProfiles([]);
      localStorage.removeItem(SELECTED_PROFILE_KEY);
    }
  }, []);

  const selectProfile = useCallback((nextProfile: Profile | null) => {
    setProfile(nextProfile);
    if (nextProfile) localStorage.setItem(SELECTED_PROFILE_KEY, nextProfile.id);
    else localStorage.removeItem(SELECTED_PROFILE_KEY);
  }, []);

  const addProfile = useCallback(async (name: string, kids: boolean) => {
    const { profile: nextProfile } = await requestJson<{ profile: Profile }>("/api/profiles", {
      method: "POST",
      body: JSON.stringify({ name, kids }),
    });
    setProfiles((current) => [...current, nextProfile]);
    return nextProfile;
  }, []);

  const updateProfile = useCallback(async (id: string, name: string, kids: boolean) => {
    const { profile: updated } = await requestJson<{ profile: Profile }>(`/api/profiles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ name, kids }),
    });
    setProfiles((current) => current.map((item) => item.id === id ? updated : item));
    setProfile((current) => current?.id === id ? updated : current);
    return updated;
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    await requestJson<{ success: boolean }>(`/api/profiles/${encodeURIComponent(id)}`, { method: "DELETE" });
    setProfiles((current) => current.filter((item) => item.id !== id));
    setProfile((current) => {
      if (current?.id !== id) return current;
      localStorage.removeItem(SELECTED_PROFILE_KEY);
      return null;
    });
  }, []);

  const authValue = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    profiles,
    ready,
    login,
    signup,
    logout,
    selectProfile,
    addProfile,
    updateProfile,
    deleteProfile,
  }), [user, profile, profiles, ready, login, signup, logout, selectProfile, addProfile, updateProfile, deleteProfile]);

  return (
    <AuthContext.Provider value={authValue}>
      <WatchlistProvider key={profile?.id ?? "signed-out"} profileId={profile?.id}>{children}</WatchlistProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AppProviders");
  return value;
}
