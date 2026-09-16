import { withDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api";
import { getProfiles, seedProfiles } from "@/lib/members";

async function handleGET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Not signed in", 401);
    let profiles = await getProfiles(user.id);
    if (!profiles.length) profiles = await seedProfiles(user.id, [{ name: user.name.split(" ")[0] || "Member" }]);
    return successResponse({ user, profiles });
  } catch {
    return errorResponse("Member service is temporarily unavailable", 503);
  }
}

export const GET = withDatabase(handleGET);
