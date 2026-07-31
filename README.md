# SICA Portfolio

Turborepo monorepo: Next.js App Router + Sanity Studio + shared packages.

## Structure

```
cms/           Sanity Studio (CMS)
ui/            Next.js site (Vercel)
packages/
  ui/          Shared React UI primitives (@sica/ui)
  lib/         Shared utilities (cn, env helpers)
  config/      Shared TypeScript, ESLint, Prettier, Tailwind/PostCSS
```

## Setup

```bash
pnpm install
cp ui/.env.example ui/.env.local
cp cms/.env.example cms/.env
# Add SANITY_API_READ_TOKEN to ui/.env.local
```

## Develop

```bash
pnpm dev          # ui + cms via Turbo
pnpm dev:ui
pnpm dev:cms
pnpm lint
pnpm typecheck
pnpm format
```

## Build

```bash
pnpm build        # all apps
pnpm build:ui
pnpm build:cms
```

## Vercel

1. Import the Git repo in Vercel.
2. Set **Root Directory** to `ui`.
3. Framework: Next.js (auto-detected).
4. Add env vars from `.env.example` (Production + Preview).
5. Optional: enable Turborepo Remote Cache (`npx turbo login` / `npx turbo link`).

Studio deploys separately via `pnpm --filter cms deploy` (Sanity-hosted) or its own Vercel project if preferred.

## Sanity

- Project ID: `qht5ld5w`
- Dataset: `production`

```bash
pnpm --filter cms deploy-schema
pnpm typegen
```

## Content scripts

```bash
pnpm scrape:webflow
SANITY_API_WRITE_TOKEN=sk... pnpm import:sanity
```
