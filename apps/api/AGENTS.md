# AGENTS.md - API Server (apps/api)

## Overview

REST API server for webhooks, health checks, and scheduled tasks. Runs on port 3002.

## File Structure

```
apps/api/
├── app/
│   ├── cron/           # Scheduled task handlers
│   ├── health/         # Health check endpoints
│   ├── layout.tsx      # Root layout
│   └── global-error.tsx
├── __tests__/          # Vitest test files
├── env.ts              # Environment variable composition
└── next.config.ts      # Next.js configuration
```

## Commands

```bash
pnpm dev        # Start development server (port 3002)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm test       # Run Vitest tests
pnpm typecheck  # TypeScript type checking
pnpm analyze    # Bundle analyzer
```

## Dependencies

### Internal Packages
- `@repo/analytics` - Analytics tracking
- `@repo/auth` - Clerk authentication (for webhook verification)
- `@repo/database` - Prisma database client
- `@repo/design-system` - Shared utilities
- `@repo/next-config` - Shared Next.js configuration

### Key External Dependencies
- `next` - Next.js 16.x
- `svix` - Webhook handling
- `zod` - Schema validation

## Endpoints

### Health Check
- `GET /health` - Returns API health status

### Cron Jobs
- `/cron/*` - Scheduled task endpoints (Vercel Cron compatible)

### Webhooks
Webhook endpoints for external service integrations (Clerk, Stripe, etc.)

## Environment Variables

Composes keys from packages via `env.ts`. Key variables:
- `DATABASE_URL` - Database connection string
- `SVIX_TOKEN` - Webhook signing secret
- `CLERK_SECRET_KEY` - For webhook verification

## Key Patterns

### Webhook Handling
Use Svix for webhook verification and delivery:
```typescript
import { Webhook } from "svix";
```

### Health Checks
The `/health` endpoint should return:
- Database connectivity status
- Service readiness

### Cron Jobs
Vercel Cron compatible endpoints in `/app/cron/`:
- Configure schedules in `vercel.json`
- Protect with `CRON_SECRET` verification

## Testing

```bash
pnpm test           # Run all tests
pnpm test --watch   # Watch mode
```

## Security Considerations

- Webhook endpoints must verify signatures
- Cron endpoints should verify `CRON_SECRET` header
- Database credentials never logged
- Rate limiting on public endpoints
