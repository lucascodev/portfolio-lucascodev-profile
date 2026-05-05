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
- **Prisma singleton** (`shared/lib/prisma/prisma.lib.ts`) — uses **Prisma 7** with `@prisma/adapter-libsql`; `new PrismaClient({ adapter })` is mandatory (Prisma 7 requires a driver adapter, no default SQLite driver).
- **Prisma client** is generated to `src/generated/prisma/` (see `schema.prisma` `output` field) — import from `@/generated/prisma/client`.
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

SQLite via libSQL. The `.db` file lives at `apps/web/dev.db` (relative to the app root, not to `prisma/`). Seed file: `apps/web/prisma/seed.ts`.
