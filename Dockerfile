FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ── builder: install deps + generate prisma + next build ──────────────────────
FROM base AS builder
WORKDIR /app

# NEXT_PUBLIC_* vars must be present at build time (inlined into JS bundle)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# copy manifests first — layer cached until any package.json changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN pnpm install --frozen-lockfile

# copy source after install so the cache above is reused on code-only changes
COPY . .

RUN pnpm --filter web exec prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm --filter web build

# ── runner: minimal production image ──────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# install prisma locally so the binary is available AND prisma/config is importable
# (global install only provides the binary — the module resolution needs a local install)
RUN npm install prisma@7

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone server (mirrors monorepo structure)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# static assets must live at apps/web/.next/static/ relative to the server
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# prisma schema + migrations + generated client for migrate deploy
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/prisma ./apps/web/prisma
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/src/generated ./apps/web/src/generated
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/prisma.config.ts ./apps/web/prisma.config.ts

COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
