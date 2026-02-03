# AGENTS.md - Next Config Package (@repo/next-config)

## Overview

Shared Next.js configuration and environment variables for all apps.

## File Structure

```
packages/next-config/
├── index.ts            # Shared Next.js config builder
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `@t3-oss/env-nextjs` - Type-safe environment variables

## Environment Variables

**Server-side:**
```
ANALYZE                         # Enable bundle analyzer (optional)
NEXT_RUNTIME                    # Runtime: "nodejs" | "edge" (optional)
VERCEL                          # Set by Vercel (optional)
VERCEL_ENV                      # "development" | "preview" | "production" (optional)
VERCEL_URL                      # Deployment URL (optional)
VERCEL_REGION                   # Deployment region (optional)
VERCEL_PROJECT_PRODUCTION_URL   # Production URL (optional)
```

**Client-side (public):**
```
NEXT_PUBLIC_APP_URL     # Main app URL (required)
NEXT_PUBLIC_WEB_URL     # Marketing site URL (required)
NEXT_PUBLIC_API_URL     # API server URL (optional)
NEXT_PUBLIC_DOCS_URL    # Documentation URL (optional)
```

From `keys.ts`:
```typescript
server: {
  ANALYZE: z.string().optional(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
  VERCEL: z.string().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  // ...
},
client: {
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_WEB_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url().optional(),
  NEXT_PUBLIC_DOCS_URL: z.url().optional(),
}
```

## Key Patterns

### Using Shared Config
In app's `next.config.ts`:
```typescript
import { createConfig } from "@repo/next-config";

const config = createConfig({
  // App-specific overrides
});

export default config;
```

### Accessing URLs
```typescript
import { keys } from "@repo/next-config/keys";

const env = keys();
const appUrl = env.NEXT_PUBLIC_APP_URL;
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

### Bundle Analysis
```bash
ANALYZE=true pnpm build
```

## Configuration Options

The shared config includes:
- Transpilation of `@repo/*` packages
- Image optimization settings
- Security headers integration
- Environment variable validation
- TypeScript strict mode settings

## URL Configuration

Set these in root `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3004
```

## Security Considerations

- Public URLs are exposed to client - ensure they're correct
- Vercel environment variables auto-populated in deployments
- Use `VERCEL_ENV` to conditionally enable features
- Never include secrets in this package
