import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

if (existsSync(resolve(__dirname, '.env'))) {
  await import('dotenv/config');
}

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
