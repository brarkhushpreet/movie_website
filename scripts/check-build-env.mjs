import { readdir } from "node:fs/promises";

// OpenNext can compile Next.js dotenv files into its Worker bundle.
// Keep credentials in runtime bindings, never in a deployment artifact.
const files = await readdir(new URL("../", import.meta.url));
const dotenvFiles = files.filter((name) => /^\.env(?:\..+)?$/.test(name) && name !== ".env.example");
if (dotenvFiles.length) {
  console.error("Cloudflare builds must run in a clean checkout without .env files. Use GitHub CI, or a separate checkout containing no local credentials.");
  process.exit(1);
}
