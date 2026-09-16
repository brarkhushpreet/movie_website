# Movie Explorer

Movie Explorer is a movie-discovery portfolio project built with the Next.js App Router, React, Tailwind CSS, and TMDB, prepared for movies.khushpreet.dev.

## What is included

- Database-backed sign-up, sign-in, secure sessions, profile selection, editing, creation, deletion, and sign-out
- Netflix-inspired responsive browse experience with hero artwork and horizontal content rails
- Movies, series, new & popular, genre, search, title detail, My List, account, and trailer-player routes
- Persistent PostgreSQL accounts, profiles, preferences, and My List; device-local profile selection
- Official trailers with YouTube playback controls; TMDB audience ratings and a shared catalog across profiles
- Server-only TMDB access with a curated fallback catalog when the API is unavailable
- Responsive desktop/mobile navigation, loading, error, and not-found experiences

## Stack

- Next.js 16 with Turbopack and App Router
- React 19.2
- Tailwind CSS 4
- TypeScript 6 (newest release compatible with the current Next.js ESLint toolchain)
- Lucide icons
- PostgreSQL through Postgres.js

## Run locally

1. Copy `.env.example` to `.env.local`, add a TMDB v4 Read Access Token, and provide a PostgreSQL `DATABASE_URL`.
2. Run `db/schema.sql` once in your PostgreSQL database (Neon's SQL Editor works).
3. Install dependencies using Node.js 24 and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For the built-in demo, choose **Fill demo account** on the sign-in page. The populated credentials are `demo@vanta.tv` / `watchnow`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Data and security

Movie Explorer salts and hashes passwords, stores only hashed session tokens, uses an HTTP-only session cookie, and checks ownership on profile, My List, and preference routes. Set up tables using `db/schema.sql` before serving requests. Database connections are scoped to each request. For a public production service, add email verification, password recovery, rate limiting, CSRF protection, a managed identity provider, and licensed video delivery. TMDB supplies metadata and artwork; this project does not provide full films or episodes.

## Cloudflare and Neon deployment

Follow [the deployment guide](docs/deployment.md) for the Neon schema, Cloudflare
Hyperdrive, Worker secret, GitHub configuration, and first deployment order.
Cloudflare builds run without local dotenv files to prevent bundling credentials.

The public repository runs checks and can request a deployment from the private
`portfolio-ops` repository. The private workflow reuses its existing
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `portfolio-deploy` runner.
Its new workflow is prepared at
`D:/projects/portfolio-ops/.github/workflows/deploy-movies.yml` and must be
committed separately. No deployment or external resource changes are made by
preparing these files.
