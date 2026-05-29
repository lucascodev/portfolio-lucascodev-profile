#!/bin/sh
set -e

if [ ! -f .env.production ]; then
  echo "Error: .env.production not found. Run this script from /opt/portfolio-lucascodev-profile"
  exit 1
fi

DB_URL=$(grep '^DATABASE_URL=' .env.production | cut -d'=' -f2-)

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL not found in .env.production"
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

# Write the Node.js script to a temp file to avoid heredoc/stdin issues with docker run
SCRIPT_FILE=$(mktemp /tmp/create-admin-XXXXXX.js)

cat > "$SCRIPT_FILE" << 'JSEOF'
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

echo "Creating admin user..."

docker run --rm \
  --network portfolio-lucascodev-profile_default \
  -e DB_URL="$DB_URL" \
  -e ADMIN_EMAIL="$ADMIN_EMAIL" \
  -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  -v "$SCRIPT_FILE":/create-admin.js \
  node:20-alpine \
  sh -c 'mkdir -p /app && cd /app && npm install --quiet --no-progress bcryptjs pg >/dev/null 2>&1 && node /create-admin.js'

rm -f "$SCRIPT_FILE"

echo "Done! Log in at: https://lucascodev.com.br/login"
