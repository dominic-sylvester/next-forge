import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local
config({ path: resolve(import.meta.dirname, ".env.local") });

export default defineConfig({
  schema: "prisma/models",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
