type LogLevel = "error" | "warn" | "info" | "debug";

interface LoggerOptions {
  name?: string;
}

const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "apiKey",
  "api_key",
  "authorization",
  "cookie",
  "creditCard",
  "credit_card",
  "ssn",
  "accessToken",
  "refreshToken",
];

const REDACT_PATTERNS = [
  { regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, replacement: "[CARD]" },
  { regex: /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, replacement: "[SSN]" },
  {
    regex: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    replacement: "[JWT]",
  },
  {
    regex: /\b(sk_live_|sk_test_|pk_live_|pk_test_)[A-Za-z0-9]{20,}\b/g,
    replacement: "[KEY]",
  },
  { regex: /\b(sk-)[A-Za-z0-9]{32,}\b/g, replacement: "[KEY]" },
];

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    let result = value;
    for (const pattern of REDACT_PATTERNS) {
      result = result.replace(pattern.regex, pattern.replacement);
    }
    return result;
  }
  if (typeof value === "object" && value !== null) {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((k) => lowerKey.includes(k.toLowerCase()))) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = sanitizeValue(value);
    }
  }
  return result;
}

const formatMessage = (
  level: LogLevel,
  name: string | undefined,
  message: string,
  data?: unknown
) => {
  const prefix = name ? `[${name}]` : "";
  const timestamp = new Date().toISOString();
  const sanitizedData = data ? sanitizeValue(data) : undefined;
  return { timestamp, level, name: prefix, message, data: sanitizedData };
};

const createClientLogger = (options: LoggerOptions = {}) => {
  const { name } = options;

  return {
    error: (message: string, data?: unknown) => {
      const log = formatMessage("error", name, message, data);
      console.error(JSON.stringify(log));
    },
    warn: (message: string, data?: unknown) => {
      const log = formatMessage("warn", name, message, data);
      console.warn(JSON.stringify(log));
    },
    info: (message: string, data?: unknown) => {
      const log = formatMessage("info", name, message, data);
      console.info(JSON.stringify(log));
    },
    debug: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === "development") {
        const log = formatMessage("debug", name, message, data);
        console.debug(JSON.stringify(log));
      }
    },
  };
};

export const logger = createClientLogger();

export const createLogger = (name: string) => createClientLogger({ name });

export type ClientLogger = ReturnType<typeof createClientLogger>;
