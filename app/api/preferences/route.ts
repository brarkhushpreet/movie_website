import { withDatabase } from "@/lib/db";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getPreferences, savePreferences } from "@/lib/members";

async function handleGET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const profileId = new URL(request.url).searchParams.get("profileId") || "";
  const preferences = await getPreferences(user.id, profileId);
  return preferences ? successResponse({ preferences }) : errorResponse("Profile not found", 404);
}

async function handlePUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const body = await readJson(request);
  const profileId = typeof body?.profileId === "string" ? body.profileId : "";
  const preferences = {
    autoplay: body?.autoplay !== false,
    previews: body?.previews !== false,
    emails: body?.emails === true,
  };
  const updated = await savePreferences(user.id, profileId, preferences);
  return updated ? successResponse({ preferences }) : errorResponse("Profile not found", 404);
}

export const GET = withDatabase(handleGET);
export const PUT = withDatabase(handlePUT);
