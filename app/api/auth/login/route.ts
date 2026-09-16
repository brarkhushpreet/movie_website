import { withDatabase } from "@/lib/db";
import { createSession, createUser, findUserByEmail, verifyPassword } from "@/lib/auth";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { getProfiles, seedProfiles } from "@/lib/members";

const DEMO_EMAIL = "demo@vanta.tv";
const DEMO_PASSWORD = "watchnow";

async function handlePOST(request: Request) {
  const body = await readJson(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return errorResponse("Enter valid sign-in details", 400);

  try {
    let user = await findUserByEmail(email);
    if (!user && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      user = await createUser("Demo Member", DEMO_EMAIL, DEMO_PASSWORD);
      await seedProfiles(user.id, [
        { name: "Alex" },
        { name: "Maya" },
      ]);
    }

    if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
      return errorResponse("Email or password is incorrect", 401);
    }

    await createSession(user.id);
    let profiles = await getProfiles(user.id);
    if (!profiles.length) profiles = await seedProfiles(user.id, [{ name: user.name.split(" ")[0] || "Member" }]);
    return successResponse({ user: { id: user.id, name: user.name, email: user.email }, profiles });
  } catch {
    return errorResponse("Unable to sign in right now", 503);
  }
}

export const POST = withDatabase(handlePOST);
