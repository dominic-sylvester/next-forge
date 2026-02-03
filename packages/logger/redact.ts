/**
 * Paths to redact in log objects (pino redact)
 * These are dot-notation paths to sensitive fields
 */
export const redactPaths = [
  "password",
  "*.password",
  "secret",
  "*.secret",
  "token",
  "*.token",
  "accessToken",
  "*.accessToken",
  "refreshToken",
  "*.refreshToken",
  "apiKey",
  "*.apiKey",
  "api_key",
  "*.api_key",
  "authorization",
  "*.authorization",
  "cookie",
  "*.cookie",
  "creditCard",
  "*.creditCard",
  "credit_card",
  "*.credit_card",
  "ssn",
  "*.ssn",
  "socialSecurityNumber",
  "*.socialSecurityNumber",
  "headers.authorization",
  "headers.cookie",
  "req.headers.authorization",
  "req.headers.cookie",
  "request.headers.authorization",
  "request.headers.cookie",
];

/**
 * Regex patterns for scrubbing sensitive data from string values
 */
export const redactPatterns = [
  // Credit card numbers (basic pattern)
  {
    regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    replacement: "[CREDIT_CARD_REDACTED]",
  },
  // SSN
  {
    regex: /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g,
    replacement: "[SSN_REDACTED]",
  },
  // Email addresses
  {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: "[EMAIL_REDACTED]",
  },
  // JWT tokens
  {
    regex: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    replacement: "[JWT_REDACTED]",
  },
  // API keys (common patterns)
  {
    regex: /\b(sk_live_|sk_test_|pk_live_|pk_test_)[A-Za-z0-9]{20,}\b/g,
    replacement: "[STRIPE_KEY_REDACTED]",
  },
  {
    regex: /\b(sk-)[A-Za-z0-9]{32,}\b/g,
    replacement: "[OPENAI_KEY_REDACTED]",
  },
  {
    regex: /\b(ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{36,}\b/g,
    replacement: "[GITHUB_TOKEN_REDACTED]",
  },
  // Bearer tokens
  {
    regex: /Bearer\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi,
    replacement: "Bearer [TOKEN_REDACTED]",
  },
  // Basic auth in URLs
  {
    regex: /:\/\/[^:]+:[^@]+@/g,
    replacement: "://[CREDENTIALS_REDACTED]@",
  },
  // Phone numbers (US format)
  {
    regex: /\b(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    replacement: "[PHONE_REDACTED]",
  },
  // IP addresses (optional - uncomment if needed)
  // {
  //   regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  //   replacement: "[IP_REDACTED]",
  // },
];

export interface RedactPattern {
  regex: RegExp;
  replacement: string;
}
