#!/bin/sh
set -e

echo "▶ Running database migrations..."
cd /app/apps/web && prisma migrate deploy

echo "▶ Starting Next.js..."
exec node /app/apps/web/server.js
