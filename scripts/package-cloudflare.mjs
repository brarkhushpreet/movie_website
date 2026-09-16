import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";
import "./check-build-env.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const release = resolve(root, "release");
if (!release.startsWith(resolve(root) + sep)) throw new Error("Invalid release path");
await access(join(root, ".open-next/worker.js"));
const hyperdriveId = process.env.MOVIES_HYPERDRIVE_ID;
if (hyperdriveId && (!/^[a-f0-9]{32}$/i.test(hyperdriveId) || /^0+$/.test(hyperdriveId))) {
  throw new Error("MOVIES_HYPERDRIVE_ID must be a real 32-character Hyperdrive configuration ID");
}
await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
// Transfer the final Worker, not OpenNext's intermediate sources/node_modules.
execFileSync(process.execPath, [
  join(root, "node_modules/wrangler/bin/wrangler.js"),
  "deploy", "--dry-run", "--config", join(root, "wrangler.jsonc"),
  "--outdir", join(release, "worker"),
], { cwd: root, stdio: "inherit", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
await cp(join(root, ".open-next/assets"), join(release, "assets"), { recursive: true });
const config = JSON.parse(await readFile(join(root, "wrangler.jsonc"), "utf8"));
delete config.$schema;
config.main = "worker/worker.js";
config.no_bundle = true;
config.assets.directory = "assets";
if (hyperdriveId) config.hyperdrive[0].id = hyperdriveId;
await writeFile(join(release, "wrangler.json"), JSON.stringify(config, null, 2) + "\n");
console.log(hyperdriveId ? "Release prepared with the Neon Hyperdrive binding." : "Release prepared for CI validation only. Set MOVIES_HYPERDRIVE_ID in portfolio-ops before deployment.");
