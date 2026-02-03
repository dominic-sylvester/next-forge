import pino from "pino";
import { keys } from "./keys";
import { redactPatterns, redactPaths } from "./redact";

const env = keys();

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: redactPaths,
    censor: "[REDACTED]",
  },
  formatters: {
    log(object) {
      return sanitizeObject(object);
    },
  },
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function sanitizeString(str: string): string {
  let result = str;
  for (const pattern of redactPatterns) {
    result = result.replace(pattern.regex, pattern.replacement);
  }
  return result;
}

export const createLogger = (name: string) => logger.child({ name });

export type Logger = typeof logger;
