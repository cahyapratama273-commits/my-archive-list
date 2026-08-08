import { defineConfig } from "@prisma/config";
import { loadEnvConfig } from "@next/env";

// Load .env dan .env.local sebelum Prisma CLI baca DATABASE_URL
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
