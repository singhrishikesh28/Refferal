import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // A missing URL must not prevent client generation during a build.
  datasource: { url: process.env.DIRECT_URL ?? '' },
});
