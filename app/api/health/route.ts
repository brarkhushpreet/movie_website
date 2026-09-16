import { getSql, withDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = withDatabase(async () => {
  const sql = getSql();
  const [result] = await sql<{ ready: boolean }[]>`
    SELECT (
      to_regclass('public.vanta_users') IS NOT NULL AND
      to_regclass('public.vanta_sessions') IS NOT NULL AND
      to_regclass('public.vanta_profiles') IS NOT NULL AND
      to_regclass('public.vanta_watchlist') IS NOT NULL AND
      to_regclass('public.vanta_preferences') IS NOT NULL
    ) AS ready
  `;
  const ready = result?.ready === true;
  return Response.json({
    status: ready ? "ok" : "setup-required",
    database: "connected",
    schema: ready ? "ready" : "missing",
    catalog: process.env.TMDB_API_KEY ? "configured" : "fallback",
  }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
});
