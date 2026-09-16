import { withDatabase } from "@/lib/db";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getWatchlist, setWatchlistItem } from "@/lib/members";
import type { MediaItem } from "@/lib/types";

async function handleGET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const profileId = new URL(request.url).searchParams.get("profileId") || "";
  const items = await getWatchlist(user.id, profileId);
  return items ? successResponse({ items }) : errorResponse("Profile not found", 404);
}

async function handlePUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const body = await readJson(request);
  const profileId = typeof body?.profileId === "string" ? body.profileId : "";
  const saved = body?.saved === true;
  const media = body?.media as MediaItem | undefined;
  if (!media || typeof media.id !== "number" || (media.media_type !== "movie" && media.media_type !== "tv")) return errorResponse("Invalid title", 400);

  const updated = await setWatchlistItem(user.id, profileId, media, saved);
  return updated ? successResponse({ success: true }) : errorResponse("Profile not found", 404);
}

export const GET = withDatabase(handleGET);
export const PUT = withDatabase(handlePUT);
