# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the monorepo root unless noted:

```bash
pnpm dev                        # start all apps in dev mode
pnpm build                      # build all packages and apps (Turborepo)
pnpm lint                       # lint all packages
pnpm typecheck                  # TypeScript check across all packages
pnpm format                     # Prettier across the whole repo

# Scoped to the web app only:
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web typecheck

# Database (run from apps/web/):
pnpm --filter web exec prisma generate
pnpm --filter web exec prisma migrate dev
pnpm --filter web exec prisma db seed
pnpm --filter web exec prisma studio
```

> The AGENTS.md in `apps/web/` warns: this is **Next.js 16.2.4** with breaking changes from previous versions. Read `node_modules/next/dist/docs/` before editing Next.js-specific behaviour.

## Architecture

Turborepo monorepo with pnpm workspaces:
- `apps/web` — Next.js 16 app (App Router, `src/` layout)
- `packages/design-system` — isolated React component + token library (`@portfolio/design-system`)
- `packages/tsconfig` — shared TypeScript base config
- `packages/eslint-config` — shared ESLint config

### Clean Architecture layers inside `apps/web/src/`

Dependency rule: **inner layers never import outer layers.**

```
domain → use-cases → infrastructure
                   → presentation → app (Next.js routes)
```

| Layer | Path | Rule |
|---|---|---|
| domain | `domain/entities/`, `domain/repositories/` | Zero external deps. Entities are plain TS types + business rules. Repositories are interfaces (ports). |
| use-cases | `use-cases/` | Imports only domain interfaces, never infrastructure. |
| infrastructure | `infrastructure/repositories/`, `infrastructure/services/` | Implements domain interfaces using Prisma. |
| presentation | `presentation/view/`, `presentation/hooks/`, `presentation/store/`, `presentation/providers/` | React components, React Query hooks, Zustand stores. |
| app | `app/` | Next.js App Router pages + API routes. Pages import views; API routes instantiate use-cases directly with their Prisma repositories. |
| shared | `shared/` | Cross-cutting utilities accessible from all layers: `shared/lib/prisma/`, `shared/lib/query-client/`, `shared/config/env/`, `shared/utils/`. |

### Key wiring points

- **API routes** (`app/api/*/route.ts`) — instantiate repository + use-case directly, no DI container.
- **Prisma singleton** (`shared/lib/prisma/prisma.lib.ts`) — uses **Prisma 7** with `@prisma/adapter-pg` (PostgreSQL); `new PrismaClient({ adapter })` is mandatory (Prisma 7 requires a driver adapter).
- **Prisma client** is generated to `src/generated/prisma/` (see `schema.prisma` `output` field) — import from `@/generated/prisma/client`. Run `prisma generate` after any schema change.
- **Auth** (`shared/config/session/session.config.ts`) — iron-session v8 with `SESSION_SECRET` env var (≥32 chars). Middleware at `src/middleware.ts` blocks POST/PATCH/DELETE on `/api/projects`, `/api/skills`, `/api/experiences`, `/api/site-config` for unauthenticated requests.
- **Admin system** — `AdminToolbar` (bottom-center pill) toggles edit mode via Zustand (`presentation/store/admin/admin.store.ts`). In edit mode, `EditButton` overlays appear on each section opening their respective modal. `AuthProvider` (`presentation/providers/auth/`) polls `/api/auth/me` to detect admin session.
- **SSR + React Query pattern** — Server Components (pages, layout) fetch `SiteConfig` directly via use-case and pass as `initialData` to hooks. This prevents hydration mismatch between server-rendered fallbacks and client-cached real data. See `app/page.tsx` and `app/layout.tsx`.
- **QueryClientProvider** lives in `presentation/providers/providers.tsx` (client component) and is mounted in `app/layout.tsx`.
- **Env validation** (`shared/config/env/env.config.ts`) — Zod schema, throws on startup if `DATABASE_URL` is missing or not a valid URL.

### Design system

`packages/design-system` sources TypeScript directly (no build step); the web app consumes it via `workspace:*`. Tailwind v4 must scan it explicitly:

```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";
@source "../../node_modules/@portfolio/design-system/src";
```

All CSS variables (colors, spacing, etc.) are inlined in `globals.css` — do **not** use `@import` of the design-system CSS file, as it does not go through the Tailwind pipeline.

### Folder naming convention

Every component, hook, utility, and entity lives in its **own subfolder** named after the file:

```
components/hero-section/hero-section.component.tsx
use-cases/get-all-projects/get-all-projects.use-case.ts
utils/format-date/format-date.util.ts
```

### Date serialization gotcha

`formatDate` / `formatDateRange` in `shared/utils/format-date/format-date.util.ts` accept `Date | string`. API responses serialize dates as ISO strings; always pass them through `new Date()` before calling `Intl.DateTimeFormat.format()` — the utility already handles this.

### Database

PostgreSQL. Connection string goes in `apps/web/.env` as `DATABASE_URL`. For local development, `docker-compose up -d` at the repo root starts a PostgreSQL container pre-configured for `DATABASE_URL` in `.env.example`. Seed file: `apps/web/prisma/seed.ts` — reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from env to create the admin user.
