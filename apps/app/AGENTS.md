# AGENTS.md - Main Application (apps/app)

## Overview

The main Next.js application providing the authenticated user experience. Runs on port 3000.

## File Structure

```
apps/app/
├── app/
│   ├── (authenticated)/    # Protected routes requiring login
│   ├── (unauthenticated)/  # Public routes (sign-in, sign-up)
│   ├── actions/            # Server actions
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout with providers
│   └── styles.css          # Global styles
├── __tests__/              # Vitest test files
├── env.ts                  # Environment variable composition
├── next.config.ts          # Next.js configuration
├── proxy.ts                # Development proxy utilities
└── vitest.config.mts       # Test configuration
```

## Commands

```bash
pnpm dev        # Start development server (port 3000)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm test       # Run Vitest tests
pnpm typecheck  # TypeScript type checking
pnpm analyze    # Bundle analyzer (ANALYZE=true)
```

## Dependencies

### Internal Packages
- `@repo/analytics` - PostHog + Google Analytics
- `@repo/auth` - Clerk authentication
- `@repo/database` - Prisma database client
- `@repo/design-system` - UI components and providers
- `@repo/next-config` - Shared Next.js configuration
- `@repo/security` - Arcjet rate limiting
- `@repo/webhooks` - Svix webhook handling

### Key External Dependencies
- `next` - Next.js 16.x
- `react` - React 19.x
- `fuse.js` - Fuzzy search
- `lucide-react` - Icons
- `zod` - Schema validation

## Environment Variables

This app composes keys from multiple packages via `env.ts`:

```typescript
import { keys as analytics } from "@repo/analytics/keys";
import { keys as auth } from "@repo/auth/keys";
import { keys as database } from "@repo/database/keys";
import { keys as email } from "@repo/email/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as security } from "@repo/security/keys";
import { keys as webhooks } from "@repo/webhooks/keys";
```

Required variables are defined in each package's `keys.ts` file.

## Route Groups

### (authenticated)
Protected routes that require user login. Clerk middleware redirects unauthenticated users to sign-in.

### (unauthenticated)
Public routes for authentication flows:
- `/sign-in` - User sign-in
- `/sign-up` - User registration

## Key Patterns

### Layout Structure
The root layout wraps the app in `DesignSystemProvider` which includes:
- Theme support (light/dark mode)
- Auth provider (Clerk)
- Toast notifications (Sonner)
- Tooltip provider (Radix)

### Server Actions
Place server actions in `app/actions/` directory.

### API Routes
API routes in `app/api/` for client-side data fetching.

## Testing

- Framework: Vitest with React Testing Library
- Environment: jsdom
- Test files: `__tests__/*.test.tsx`

```bash
pnpm test           # Run all tests
pnpm test --watch   # Watch mode
```

## Security Considerations

- All auth routes are protected by Clerk middleware
- Environment variables validated at build time via `env.ts`
- Server-side keys never exposed to client bundle
- Rate limiting available via `@repo/security`
