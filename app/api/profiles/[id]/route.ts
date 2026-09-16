import { withDatabase } from "@/lib/db";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { deleteProfile, updateProfile } from "@/lib/members";

type Context = { params: Promise<{ id: string }> };

async function handlePATCH(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const { id } = await params;
  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const kids = body?.kids === true;
  if (name.length < 2 || name.length > 18) return errorResponse("Profile name must be 2–18 characters", 400);

  const profile = await updateProfile(user.id, id, name, kids);
  return profile ? successResponse({ profile }) : errorResponse("Profile not found", 404);
}

async function handleDELETE(_request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);
  const { id } = await params;
  try {
    const deleted = await deleteProfile(user.id, id);
    return deleted ? successResponse({ success: true }) : errorResponse("Profile not found", 404);
  } catch (error) {
    if (error instanceof Error && error.message === "LAST_PROFILE") return errorResponse("Keep at least one profile", 409);
    return errorResponse("Unable to delete this profile", 503);
  }
}

export const PATCH = withDatabase(handlePATCH);
export const DELETE = withDatabase(handleDELETE);
