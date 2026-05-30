#!/bin/sh
set -e

# Detect environment: pass "prod" as first argument to use .env.production
ENV="${1:-dev}"

if [ "$ENV" = "prod" ]; then
  ENV_FILE=".env.production"
else
  ENV_FILE=".env"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found. Run this script from the repo root."
  exit 1
fi

echo "Using environment: $ENV ($ENV_FILE)"

DB_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | cut -d'=' -f2-)

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL not found in $ENV_FILE"
  exit 1
fi

printf "Enter admin email: "
read -r ADMIN_EMAIL

printf "Enter admin password: "
read -r ADMIN_PASSWORD

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "Error: email and password are required."
  exit 1
fi

echo "Creating admin user..."

NETWORK="--network portfolio-lucascodev-profile_default"

# Pass the script via stdin to avoid Windows path conversion issues with volume mounts
docker run --rm -i \
  $NETWORK \
  -e DB_URL="$DB_URL" \
  -e ADMIN_EMAIL="$ADMIN_EMAIL" \
  -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  node:20-alpine \
  sh -c 'mkdir -p /app && cd /app && npm install --quiet --no-progress bcryptjs pg >/dev/null 2>&1 && cat > /app/run.js && node /app/run.js' << 'JSEOF'
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
(async () => {
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const id = require('crypto').randomUUID();
  const client = new Client({ connectionString: process.env.DB_URL });
  await client.connect();
  const res = await client.query('SELECT id FROM "User" WHERE email = $1', [process.env.ADMIN_EMAIL]);
  if (res.rows.length > 0) {
    await client.query('UPDATE "User" SET "passwordHash" = $1 WHERE email = $2', [hash, process.env.ADMIN_EMAIL]);
    console.log('Password updated successfully!');
  } else {
    await client.query(
      'INSERT INTO "User" (id, email, "passwordHash", "createdAt") VALUES ($1, $2, $3, NOW())',
      [id, process.env.ADMIN_EMAIL, hash]
    );
    console.log('Admin user created successfully!');
  }
  await client.end();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
JSEOF

if [ "$ENV" = "prod" ]; then
  echo "Done! Log in at: https://lucascodev.com.br/login"
else
  echo "Done! Log in at: http://localhost:3000/login"
fi
