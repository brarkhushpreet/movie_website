import { withDatabase } from "@/lib/db";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { createProfile, getProfiles } from "@/lib/members";

async function handleGET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  return successResponse({ profiles: await getProfiles(user.id) });
}

async function handlePOST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const kids = body?.kids === true;
  if (name.length < 2 || name.length > 18) return errorResponse("Profile name must be 2–18 characters", 400);

  try {
    const profile = await createProfile(user.id, name, kids);
    return successResponse({ profile }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "PROFILE_LIMIT") return errorResponse("You can have up to five profiles", 409);
    return errorResponse("Unable to create this profile", 503);
  }
}

export const GET = withDatabase(handleGET);
export const POST = withDatabase(handlePOST);
