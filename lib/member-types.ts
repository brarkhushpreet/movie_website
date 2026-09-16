import type { MediaItem } from "./types";

export type MemberUser = {
  id: string;
  name: string;
  email: string;
};

export type MemberProfile = {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  kids: boolean;
};

export type MemberSessionPayload = {
  user: MemberUser;
  profiles: MemberProfile[];
};

export type PlaybackPreferences = {
  autoplay: boolean;
  previews: boolean;
  emails: boolean;
};

export type WatchlistPayload = {
  items: MediaItem[];
};
