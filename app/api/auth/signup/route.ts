import { withDatabase } from "@/lib/db";
import { createSession, createUser } from "@/lib/auth";
import { errorResponse, readJson, successResponse } from "@/lib/api";
import { seedProfiles } from "@/lib/members";

async function handlePOST(request: Request) {
  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 60) return errorResponse("Enter your name", 400);
  if (!/^\S+@\S+\.\S+$/.test(email)) return errorResponse("Enter a valid email address", 400);
  if (password.length < 8) return errorResponse("Password must be at least 8 characters", 400);

  try {
    const user = await createUser(name, email, password);
    const firstName = name.split(" ")[0] || "Member";
    const profiles = await seedProfiles(user.id, [{ name: firstName }]);
    await createSession(user.id);
    return successResponse({ user: { id: user.id, name: user.name, email: user.email }, profiles }, 201);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "23505") return errorResponse("An account with this email already exists", 409);
    return errorResponse("Unable to create your account right now", 503);
  }
}

export const POST = withDatabase(handlePOST);
