# AGENTS.md - Auth Package (@repo/auth)

## Overview

Clerk authentication configuration, providers, and utilities for the monorepo.

## File Structure

```
packages/auth/
├── components/         # Auth-related UI components
├── client.ts           # Client-side auth utilities
├── server.ts           # Server-side auth utilities
├── provider.tsx        # AuthProvider component
├── proxy.ts            # Auth proxy utilities
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `@clerk/nextjs` - Clerk Next.js SDK
- `@clerk/themes` - Clerk theming
- `next-themes` - Theme integration

## Environment Variables

**Server-side (secret):**
```
CLERK_SECRET_KEY    # Clerk secret key (starts with sk_)
```

**Client-side (public):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     # Clerk publishable key (starts with pk_)
NEXT_PUBLIC_CLERK_SIGN_IN_URL         # Sign-in page URL (e.g., /sign-in)
NEXT_PUBLIC_CLERK_SIGN_UP_URL         # Sign-up page URL (e.g., /sign-up)
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL   # Redirect after sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL   # Redirect after sign-up
```

From `keys.ts`:
```typescript
server: {
  CLERK_SECRET_KEY: z.string().startsWith("sk_").optional(),
},
client: {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith("/"),
  // ...
}
```

## Key Patterns

### Server-side Auth
```typescript
import { auth } from "@repo/auth/server";

const { userId } = await auth();
if (!userId) {
  redirect("/sign-in");
}
```

### Client-side Auth
```typescript
import { useAuth, useUser } from "@repo/auth/client";

const { isSignedIn, userId } = useAuth();
const { user } = useUser();
```

### AuthProvider
Included in `DesignSystemProvider`, or use directly:
```typescript
import { AuthProvider } from "@repo/auth/provider";

<AuthProvider>
  {children}
</AuthProvider>
```

## Middleware Configuration

Clerk middleware should be configured in the app's `middleware.ts`:
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Security Considerations

- `CLERK_SECRET_KEY` is highly sensitive - never expose to client
- Server-only utilities in `server.ts` use `server-only` package
- Validate all auth state server-side before sensitive operations
- Use Clerk webhooks for user sync, verified via Svix
- Session tokens automatically handled by Clerk middleware
