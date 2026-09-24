import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts', // popula o banco com os dados iniciais
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
