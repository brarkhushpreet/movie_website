# Deploy movies.khushpreet.dev

This is a full-stack Next.js application, deployed as the `khushpreet-movies`
Cloudflare **Worker** through OpenNext. Neon stores accounts, sessions, profiles,
preferences, and watchlists. TMDB supplies the catalog. No movie files are stored.

## What is prepared

- `wrangler.jsonc`: Worker, assets, custom domain, and Hyperdrive binding.
- `open-next.config.ts`: adapter for the existing Next.js app.
- `db/schema.sql`: repeatable, non-destructive initial PostgreSQL schema.
- `.github/workflows/ci-cd.yml`: public checks and optional private deployment dispatch.
- `D:/projects/portfolio-ops/.github/workflows/deploy-movies.yml`: private build/deploy workflow.
- `GET /api/health`: checks the Neon connection and the five required tables.

The existing Next.js implementation stays in place. OpenNext is used to adapt
its build; this is not a migration to vinext. The catalog is rendered at runtime
and images come directly from TMDB, so this configuration needs no R2, KV,
Durable Object, or Cloudflare Images resources.

## 1. Neon — create the database and schema

1. In the Neon dashboard, create a project on the **Free** plan, for example
   `movie-explorer`. Choose the region appropriate for your expected audience.
2. Select the production branch and its database.
3. Open **SQL Editor**, paste the contents of `db/schema.sql`, and run it once.
   This creates five `vanta_*` tables. The internal names are retained to preserve
   compatibility with the existing database; the public brand is Movie Explorer.
4. Open **Connect** and turn **connection pooling off** to obtain the direct
   PostgreSQL connection details for Hyperdrive. Hyperdrive supplies pooling.
5. Keep connection details in the provider dashboards. Do not put them into
   GitHub source files, Actions variables, workflow inputs, issues, or chat.

Creating this schema creates an empty database. It does not transfer existing
local accounts or watchlists. New users can sign up after deployment; the
existing demo-account flow creates its own demo profiles on first use.

## 2. Cloudflare — connect Neon and prepare runtime configuration

Use the same Cloudflare account and `khushpreet.dev` zone as the portfolio/blog.

1. Go to **Hyperdrive → Create configuration**. Name it `movies-neon` and enter
   Neon's direct connection details using the dashboard. Keep the required
   encrypted database connection enabled.
2. **Disable query caching** for this Hyperdrive configuration. Sessions,
   ownership checks, and watchlists must read current data; connection pooling
   still works with query caching disabled.
3. Copy the resulting **Hyperdrive configuration ID**. This ID is not a database
   password. It is used in the GitHub variable below.
4. In **Workers & Pages**, create an initial Hello World **Worker** named
   `khushpreet-movies`. Use this only to establish the Worker and its runtime
   secret before the first application deployment. Do not connect this Worker
   to GitHub Builds; the existing private deployment runner will deploy it.
5. Open the Worker's **Settings → Variables and Secrets**. Add `TMDB_API_KEY`
   as a **Secret**, using the TMDB API Read Access Token (v4 bearer token).
   This app's variable name says “key,” but it expects the read-access token.
6. Do not add `DATABASE_URL` to the deployed Worker: the app uses the
   `HYPERDRIVE` binding. Local `next dev` continues to use `DATABASE_URL`.

The deployment config attaches `movies.khushpreet.dev` as a Worker Custom Domain
and disables the application's workers.dev and version-preview URLs. Cloudflare
manages DNS/TLS for the Custom Domain. You do not need to create an A record or
guess a CNAME target. If an existing DNS record or Worker already owns the
`movies` hostname, resolve that conflict before deploying; leave the portfolio
and blog hostnames alone.

## 3. GitHub — keep deployment credentials in portfolio-ops

Use **Settings → Secrets and variables → Actions** in the indicated repository:

| Repository | Type | Name | Action |
| --- | --- | --- | --- |
| `portfolio-ops` | Secret | `CLOUDFLARE_API_TOKEN` | Reuse the existing secret |
| `portfolio-ops` | Secret | `CLOUDFLARE_ACCOUNT_ID` | Reuse the existing secret |
| `portfolio-ops` | Variable | `MOVIES_HYPERDRIVE_ID` | Add the new Hyperdrive configuration ID |
| `movie_website` | Secret | `OPS_DISPATCH_TOKEN` | Add a fine-grained GitHub token that can dispatch Actions in `portfolio-ops` |
| `movie_website` | Variable | `AUTO_DEPLOY` | Leave unset initially; set `true` after the first successful deployment |

The dispatch token needs access to **only `portfolio-ops`**, with
**Actions: read and write**. Reuse your existing portfolio/blog dispatch-token
arrangement if it has this access. Repository secrets are not automatically
shared between repositories.

The existing Cloudflare token remains in `portfolio-ops`; do not duplicate it
in the public movie repository. It must allow Worker script deployment and
Custom Domain/route management for the same account and zone. Check that it
also has **Account → Hyperdrive → Read** access for the new binding.
If the token is restricted to the deployment runner's IP, keep that restriction.
No Neon password or TMDB token is required in GitHub.

## 4. Commit and run the first deployment

1. Review and commit the movie application changes to `movie_website/main`.
   The deletion of the tracked `.env` entry is intentional: your local file
   remains on disk and is now ignored. Do not re-add it.
2. Separately commit the new `deploy-movies.yml` file in `portfolio-ops/main`.
   Existing portfolio and blog workflows are unchanged.
3. Let **Movies CI** pass. Copy the full 40-character SHA of that movie commit.
4. In `portfolio-ops → Actions → Deploy movies → Run workflow`, choose
   `main` and enter that SHA as `commit`.
5. Ensure the existing runner labelled
   `self-hosted, linux, x64, portfolio-deploy` is online.
6. The workflow builds on GitHub's hosted Linux runner, transfers only the
   compiled release, and deploys using the private runner and the two existing
   Cloudflare secrets. It refuses to deploy a commit that is no longer the
   latest movie `main` commit.
7. It checks the login page and `/api/health`. Success requires a working
   Neon connection, all five tables, and a configured TMDB token.
8. Check signup/login, profile selection, and adding/removing a saved title.
   Then enable `AUTO_DEPLOY=true` in `movie_website` if you want successful
   future pushes to main to deploy automatically.

The Worker keeps serving when the private runner is offline; only deployments
need the runner. Do not also enable Cloudflare GitHub Builds for this app.

## Build and local development

For ordinary local development, keep `DATABASE_URL` and `TMDB_API_KEY` in
your ignored local environment file, run `db/schema.sql` against your local
database once, then use `npm run dev`.

Cloudflare deployment builds must run in a **clean checkout without dotenv
files**. OpenNext can embed dotenv values into its output; the build guard
deliberately refuses a checkout containing them. GitHub builds do not need
database or TMDB credentials.

In a clean checkout with Node.js 24:

```bash
npm ci
npm run lint
npm run typecheck
npm run build:cloudflare
npm run package:cloudflare
npx wrangler deploy --dry-run --config release/wrangler.json
```

Use Linux (including WSL) for deployment builds, as the workflows do.
The complete build and packaged Worker dry run were verified in Linux;
Windows-native OpenNext packaging encountered symlink/tracing issues.
Packaging emits a standalone Worker and static assets without carrying the
build's `node_modules` or intermediate Next.js sources onto the private runner.

`MOVIES_HYPERDRIVE_ID` is substituted into the release configuration during
packaging. Without it, packaging produces a validation-only placeholder, and
the private deployment workflow refuses to proceed. The zeros in the committed
`wrangler.jsonc` are intentional; do not put a database URL there.

Use `npm run preview:cloudflare` for local Workers preview after packaging.
Hyperdrive preview requires its local connection setting:
`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`. Configure this
privately in your local shell or use the Cloudflare-documented local setup;
do not commit a real connection string into Wrangler configuration.
The preview and production schema must be created beforehand.

## Costs and launch checks

- Neon Free is suitable for a modest portfolio database within its quotas.
  It sleeps when idle, and a first connection can take longer.
- Hyperdrive has a Workers Free allowance. The database and Worker quotas
  are separate.
- **Do not assume the full application will fit Workers Free's CPU limit.**
  Next.js server rendering and the existing scrypt password hashing can exceed
  the Free plan's 10 ms/request allowance. Check live usage/errors before
  sharing the site. A Workers Paid plan may be needed; this code does not
  activate or purchase one.
- The existing demo login is shared demo data. Do not use it for private data.
- `.env` was previously tracked by Git. If actual credentials were ever
  pushed, rotate them in the provider dashboards. Removing the tracked file
  does not erase older commits. History was not rewritten.
- This prepares deployment of a portfolio demo. Existing limitations such as
  no password recovery, email verification, or login rate limiter remain.

## Official references

- [OpenNext on Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)
- [Request-scoped database connections](https://opennext.js.org/cloudflare/howtos/db)
- [Neon and Hyperdrive](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon/)
- [Hyperdrive query caching](https://developers.cloudflare.com/hyperdrive/configuration/query-caching/)
- [Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
