# AGENTS.md - Security Package (@repo/security)

## Overview

Security utilities including Arcjet rate limiting and Nosecone security headers.

## File Structure

```
packages/security/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
├── arcjet/             # Arcjet rate limiting
├── headers/            # Nosecone security headers
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `@arcjet/next` - Arcjet for Next.js
- `@nosecone/next` - Security headers

## Environment Variables

**Server-side (secret):**
```
ARCJET_KEY    # Arcjet API key (starts with ajkey_, optional)
```

From `keys.ts`:
```typescript
server: {
  ARCJET_KEY: z.string().startsWith("ajkey_").optional(),
}
```

## Key Patterns

### Rate Limiting with Arcjet
```typescript
import { rateLimit } from "@repo/security";

export async function POST(request: Request) {
  const decision = await rateLimit(request);
  
  if (decision.isDenied()) {
    return new Response("Too Many Requests", { status: 429 });
  }
  
  // Process request...
}
```

### Security Headers with Nosecone
Applied via Next.js config:
```typescript
import { securityHeaders } from "@repo/security";

const nextConfig = {
  headers: securityHeaders,
};
```

Includes:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## Arcjet Features

- **Rate Limiting**: Protect against abuse
- **Bot Detection**: Block automated attacks
- **Email Validation**: Prevent fake signups
- **Shield**: WAF-like protection

## Configuration

Rate limit rules can be configured per-route:
```typescript
import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 100,
    }),
  ],
});
```

## Security Considerations

- `ARCJET_KEY` is sensitive - never expose to client
- Configure appropriate rate limits per endpoint
- Monitor Arcjet dashboard for attack patterns
- Security headers applied to all routes via Next.js config
- Test CSP rules to avoid breaking legitimate functionality
