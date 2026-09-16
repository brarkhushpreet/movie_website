import { withDatabase } from "@/lib/db";
import { destroySession } from "@/lib/auth";
import { successResponse } from "@/lib/api";

async function handlePOST() {
  await destroySession();
  return successResponse({ success: true });
}

export const POST = withDatabase(handlePOST);
