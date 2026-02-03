# AGENTS.md - next-forge

This file provides guidance to AI coding agents when working with this repository.

## Project Overview

next-forge is a production-grade Turborepo monorepo for Next.js SaaS applications. It provides integrated authentication (Clerk), database (Prisma/Neon PostgreSQL), design system (shadcn/ui), payments (Stripe), and observability (Sentry, BetterStack).

## Monorepo Structure

```
next-forge/
├── apps/
│   ├── app/        # Main application (port 3000) - authenticated user experience
│   ├── api/        # REST API server (port 3002) - webhooks, health checks
│   ├── docs/       # Documentation (Mintlify, port 3004)
│   ├── email/      # Email template preview (React Email, port 3003)
│   └── storybook/  # Component development (Storybook, port 6006)
├── packages/
│   ├── design-system/  # UI components (shadcn/ui), providers, styles
│   ├── database/       # Prisma client, schema, database utilities
│   ├── auth/           # Clerk authentication configuration
│   ├── analytics/      # Google Analytics + PostHog integration
│   ├── security/       # Arcjet rate limiting, secure headers
│   ├── email/          # Resend email utilities
│   ├── webhooks/       # Svix inbound/outbound webhook handling
│   ├── storage/        # Vercel Blob file uploads
│   ├── ai/             # AI SDK integration (OpenAI)
│   ├── next-config/    # Shared Next.js configuration
│   ├── rate-limit/     # Upstash Redis rate limiting
│   └── typescript-config/  # Shared TypeScript configuration
└── turbo/              # Turborepo generators
```

## Common Commands

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm build                  # Build all apps and packages
pnpm test                   # Run tests across all apps

# Linting & Formatting (Biome via ultracite)
pnpm check                  # Check linting/formatting issues
pnpm fix                    # Auto-fix linting/formatting issues

# Database
pnpm migrate                # Format, generate, and push Prisma schema
docker compose up -d        # Start local PostgreSQL

# Dependencies
pnpm bump-deps              # Update all dependencies
pnpm bump-ui                # Update shadcn/ui components
```

## Key Architectural Patterns

### Environment Variables
- All global env vars live in root `.env.local`
- Turborepo's `envMode: "loose"` passes them to all packages
- Each package has a `keys.ts` file using `@t3-oss/env-nextjs` for type-safe validation
- Apps compose package keys via their `env.ts` file

### Package Imports
Use `@repo/*` aliases to import from packages:
```typescript
import { Button } from "@repo/design-system/components/ui/button";
import { database } from "@repo/database";
import { auth } from "@repo/auth/server";
```

### Route Groups (apps/app)
- `(authenticated)/` - Protected routes requiring login
- `(unauthenticated)/` - Public routes (sign-in, sign-up)

### Design System Provider
Apps wrap children in `<DesignSystemProvider>` which composes:
- `ThemeProvider` (next-themes)
- `AuthProvider` (Clerk)
- `TooltipProvider` (Radix)
- `Toaster` (Sonner)

## Code Style

- **Linting/Formatting**: Biome (extends ultracite presets)
- **TypeScript**: Strict mode enabled
- **Components**: shadcn/ui "new-york" style with neutral base colors
- **Testing**: Vitest with React Testing Library, jsdom environment

## Security Considerations

### Environment Variables
- NEVER commit `.env.local` or any secrets to version control
- Server-side keys (prefixed without `NEXT_PUBLIC_`) are never exposed to clients
- All keys are validated at build time via `keys.ts` files

### Sensitive Packages
- `@repo/auth` - Contains Clerk secret keys
- `@repo/database` - Contains database connection strings
- `@repo/email` - Contains Resend API tokens
- `@repo/webhooks` - Contains Svix webhook secrets
- `@repo/ai` - Contains OpenAI API keys
- `@repo/security` - Contains Arcjet keys

### API Key Prefixes (for validation)
- Clerk: `sk_` (secret), `pk_` (publishable)
- PostHog: `phc_`
- Arcjet: `ajkey_`
- Svix: `sk_` or `testsk_`
- Resend: `re_`
- OpenAI: `sk-`

## Testing

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/app && pnpm test
cd apps/api && pnpm test

# Type checking
pnpm typecheck
```

## Database

- Prisma 7.x with Neon PostgreSQL adapter
- Schema files in `packages/database/prisma/models/`
- Generated client outputs to `packages/database/generated/prisma`
- Local development: `docker compose up -d` starts PostgreSQL

## Integration Points

Each package is designed to be consumed by apps via the `@repo/*` alias. Dependencies flow:
- Apps depend on packages
- Packages may depend on other packages (e.g., `@repo/webhooks` depends on `@repo/auth`)
- `@repo/design-system` depends on `@repo/auth` for AuthProvider
