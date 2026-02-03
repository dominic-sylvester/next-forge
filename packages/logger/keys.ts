import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace"])
        .optional()
        .default("info"),
    },
    runtimeEnv: {
      LOG_LEVEL: process.env.LOG_LEVEL,
    },
  });
