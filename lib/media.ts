import type { MediaDetails, MediaItem, MediaType } from "./types";

export function mediaTitle(media: MediaItem | MediaDetails) {
  return media.title || media.name || media.original_title || media.original_name || "Untitled";
}

export function mediaDate(media: MediaItem | MediaDetails) {
  return media.release_date || media.first_air_date || "";
}

export function mediaYear(media: MediaItem | MediaDetails) {
  return mediaDate(media).slice(0, 4) || "New";
}

export function mediaType(media: MediaItem): MediaType {
  return media.media_type === "tv" ? "tv" : "movie";
}

export function imageUrl(
  path: string | null | undefined,
  size: "w342" | "w500" | "w780" | "w1280" | "original" = "w780",
) {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/No_Image_Available.jpg";
}

export function mediaRating(media: MediaItem | MediaDetails) {
  return Number.isFinite(media.vote_average) && media.vote_average > 0
    ? `${media.vote_average.toFixed(1)}/10 TMDB`
    : "Not yet rated";
}

export function formatRuntime(minutes?: number) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours ? `${hours}h ${remaining}m` : `${remaining}m`;
}

export function truncate(text: string, length = 170) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}
