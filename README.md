# SICA Portfolio

Turborepo monorepo: Next.js App Router + Sanity Studio + shared packages.

## Structure

```
apps/
  web/       Next.js site (Vercel)
  studio/    Sanity Studio
packages/
  ui/        Shared React UI primitives
  lib/       Shared utilities (cn, env helpers)
  config/    Shared TypeScript, ESLint, Prettier, Tailwind/PostCSS
```

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
# Add SANITY_API_READ_TOKEN to apps/web/.env.local
```

## Develop

```bash
pnpm dev          # web + studio via Turbo
pnpm dev:web
pnpm dev:studio
pnpm lint
pnpm typecheck
pnpm format
```

## Build

```bash
pnpm build        # all apps
pnpm build:web
pnpm build:studio
```

## Vercel

1. Import the Git repo in Vercel.
2. Set **Root Directory** to `apps/web`.
3. Framework: Next.js (auto-detected).
4. Add env vars from `.env.example` (Production + Preview).
5. Optional: enable Turborepo Remote Cache (`npx turbo login` / `npx turbo link`).

Studio deploys separately via `pnpm --filter studio deploy` (Sanity-hosted) or its own Vercel project if preferred.

## Sanity

- Project ID: `qht5ld5w`
- Dataset: `production`

```bash
pnpm --filter studio deploy-schema
pnpm typegen
```

## Content scripts

```bash
pnpm scrape:webflow
SANITY_API_WRITE_TOKEN=sk... pnpm import:sanity
```
