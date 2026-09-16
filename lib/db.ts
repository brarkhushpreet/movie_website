import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import postgres from "postgres";

type DatabaseScope = { client?: ReturnType<typeof postgres> };
const databaseScope = new AsyncLocalStorage<DatabaseScope>();

export function getSql() {
  const scope = databaseScope.getStore();
  if (!scope) throw new Error("Database access requires withDatabase");
  if (scope.client) return scope.client;

  const onCloudflare = process.env.DEPLOYMENT_TARGET === "cloudflare";
  const databaseUrl = onCloudflare
    ? (getCloudflareContext().env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE?.connectionString
    : process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Database connection is not configured");

  const connectionUrl = new URL(databaseUrl);
  connectionUrl.searchParams.delete("schema");
  scope.client = postgres(connectionUrl.toString(), {
    max: 5,
    connect_timeout: 10,
    idle_timeout: 5,
    fetch_types: false,
    prepare: false,
  });
  return scope.client;
}

// Workers cannot reuse TCP sockets or pending promises from another request.
export function withDatabase<Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) {
  return (...args: Args): Promise<Response> => databaseScope.run({}, async () => {
    try {
      return await handler(...args);
    } catch {
      // Never return driver errors: they can contain connection details.
      return Response.json({ error: "Member service is temporarily unavailable" }, {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    } finally {
      await databaseScope.getStore()?.client?.end({ timeout: 1 }).catch(() => undefined);
    }
  });
}
