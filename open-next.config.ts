import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Dynamic catalog pages do not require R2, KV, or Durable Objects.
export default defineCloudflareConfig();
