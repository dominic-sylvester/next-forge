# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

next-forge is a production-grade Turborepo monorepo for Next.js SaaS applications. It provides a comprehensive starting point with integrated authentication (Clerk), database (Prisma/Neon PostgreSQL), design system (shadcn/ui), payments (Stripe), and observability (Sentry, BetterStack).

## Common Commands

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm build                  # Build all apps and packages
pnpm test                   # Run tests across all apps

# Linting & Formatting (uses Biome via ultracite)
pnpm check                  # Check linting/formatting issues
pnpm fix                    # Auto-fix linting/formatting issues

# Database (Prisma)
pnpm migrate                # Format, generate, and push schema to database

# Run single app tests
cd apps/app && pnpm test    # Run app tests only
cd apps/api && pnpm test    # Run API tests only

# Update dependencies
pnpm bump-deps              # Update all dependencies
pnpm bump-ui                # Update shadcn/ui components
```

## Architecture

### Monorepo Structure

- **apps/** - Deployable applications
  - `app/` - Main application (port 3000) - authenticated user experience
  - `api/` - REST API server (port 3002) - webhooks, health checks
  - `web/` - Marketing website (port 3001)
  - `docs/` - Documentation (Mintlify)
  - `email/` - Email templates (React Email)
  - `storybook/` - Component development environment

- **packages/** - Shared libraries consumed by apps
  - `design-system/` - UI components (shadcn/ui, 53 components), providers, styles
  - `database/` - Prisma client, schema, database utilities
  - `auth/` - Clerk authentication configuration and providers
  - `analytics/` - Google Analytics + PostHog integration
  - `security/` - Arcjet rate limiting, secure headers
  - `email/` - Resend email utilities
  - `webhooks/` - Inbound/outbound webhook handling (Svix)
  - `storage/` - File upload management
  - `ai/` - AI integration utilities
  - `next-config/` - Shared Next.js configuration

### Key Architectural Patterns

**Environment Variables**: All global env vars live in root `.env.local`. Turborepo's `envMode: "loose"` passes them to all packages. Each package has a `keys.ts` file using `@t3-oss/env-nextjs` for type-safe validation of only the variables it needs.

**Design System Provider**: Apps wrap children in `<DesignSystemProvider>` which composes `ThemeProvider`, `AuthProvider`, `TooltipProvider`, and `Toaster`.

**Route Groups**: The app uses Next.js route groups for authentication boundaries:
- `(authenticated)/` - Protected routes requiring login
- `(unauthenticated)/` - Public routes (sign-in, sign-up)

**Package Imports**: Use `@repo/*` aliases to import from packages (e.g., `@repo/design-system`, `@repo/database`, `@repo/auth`).

### Database

- Prisma 7.x with Neon PostgreSQL adapter
- Schema files in `packages/database/prisma/models/`
- Generated client outputs to `packages/database/generated/prisma`
- For local development, use `docker compose up -d` to start PostgreSQL

### Testing

- Vitest with React Testing Library
- Test files in `apps/*/__ tests __/`
- Uses jsdom environment for component testing

### Code Style

- Biome for linting/formatting (extends ultracite presets)
- TypeScript with strict mode
- shadcn/ui components use "new-york" style with neutral base colors
