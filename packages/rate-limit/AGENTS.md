# AGENTS.md - Rate Limit Package (@repo/rate-limit)

## Overview

Rate limiting utilities using Upstash Redis for distributed rate limiting.

## File Structure

```
packages/rate-limit/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- Upstash Redis client (via `@repo/security` or direct)

## Environment Variables

**Server-side (secret):**
```
UPSTASH_REDIS_REST_URL      # Upstash Redis REST URL (optional)
UPSTASH_REDIS_REST_TOKEN    # Upstash Redis REST token (optional)
```

From `keys.ts`:
```typescript
server: {
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
}
```

## Key Patterns

### Basic Rate Limiting
```typescript
import { rateLimit } from "@repo/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  const { success, limit, remaining, reset } = await rateLimit.limit(ip);
  
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }
  
  // Process request...
}
```

### Sliding Window Rate Limiter
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
});
```

### Per-User Rate Limiting
```typescript
const { userId } = await auth();
const identifier = userId ?? ip;

const { success } = await rateLimit.limit(identifier);
```

## Configuration Options

- **Fixed Window**: Simple, resets at intervals
- **Sliding Window**: Smoother rate limiting
- **Token Bucket**: Allows bursts within limits

## Rate Limit Headers

Include these headers in responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Unix timestamp when limit resets

## Security Considerations

- `UPSTASH_REDIS_REST_TOKEN` grants Redis access - never expose
- Rate limit by user ID when authenticated, IP when anonymous
- Set appropriate limits per endpoint (auth endpoints stricter)
- Use `x-forwarded-for` header with caution (can be spoofed)
- Consider using Arcjet (`@repo/security`) for advanced protection
- Monitor rate limit hits to detect abuse patterns
