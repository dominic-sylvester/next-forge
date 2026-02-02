# Environment Variables Guide

## Overview

This monorepo uses a **consolidated environment variable approach** where all global environment variables are defined in the root `.env.local` file. Turborepo's `envMode: "loose"` configuration automatically makes these variables available to all packages and apps.

## Structure

```
next-forge/
├── .env.local              # ✅ Global environment variables (root)
├── .env.example            # ✅ Template for .env.local
├── packages/
│   ├── auth/
│   │   └── keys.ts         # Validates auth-related env vars
│   ├── database/
│   │   ├── keys.ts         # Validates database env vars
│   │   └── .env.local      # Package-specific (for Prisma CLI)
│   └── .../
│       └── keys.ts         # Each package validates what it needs
└── apps/
    ├── app/
    │   └── .env.example    # App-specific template (if needed)
    └── api/
        └── .env.example    # App-specific template (if needed)
```

## How It Works

### 1. Root-Level Environment Variables

All global environment variables are defined in the **root** `.env.local` file. This includes:

- Database connections
- API keys (OpenAI, Clerk, Resend, etc.)
- Application URLs
- Analytics configurations
- And more...

### 2. Turborepo Configuration

The `turbo.json` file is configured with:

```json
{
  "globalDependencies": ["**/.env.*local"],
  "envMode": "loose"
}
```

- `globalDependencies`: Turbo watches all `.env.local` files for changes
- `envMode: "loose"`: All environment variables from the root are automatically passed to all tasks (build, dev, etc.)

### 3. Package-Level Validation

Each package has a `keys.ts` file that:

- Validates **only the environment variables it needs**
- Uses `@t3-oss/env-nextjs` for runtime validation
- Provides type-safe access to environment variables

Example from `packages/auth/keys.ts`:

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      CLERK_SECRET_KEY: z.string().startsWith("sk_").optional(),
      CLERK_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
    },
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
      // ... other client vars
    },
    runtimeEnv: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      // ... maps process.env to validated schema
    },
  });
```

### 4. Special Case: Database Package

The `packages/database` directory has its own `.env.local` file because:

- Prisma CLI operations (migrations, generate, etc.) need direct access to `DATABASE_URL`
- The `prisma.config.ts` file loads this local file explicitly
- This allows running `pnpm build` directly in the database package

## Setup Instructions

### Initial Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your values:**
   Edit `.env.local` and add your API keys, database URLs, etc.

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

### Adding New Environment Variables

When adding a new environment variable:

1. **Add to root `.env.local`:**
   ```bash
   # In .env.local
   NEW_API_KEY="your-key-here"
   ```

2. **Add to root `.env.example`:**
   ```bash
   # In .env.example (with helpful comments)
   # My Service API Key
   # Get from: https://example.com/dashboard
   NEW_API_KEY=""
   ```

3. **Add validation in the relevant package's `keys.ts`:**
   ```typescript
   // In packages/my-package/keys.ts
   export const keys = () =>
     createEnv({
       server: {
         NEW_API_KEY: z.string().min(1),
       },
       runtimeEnv: {
         NEW_API_KEY: process.env.NEW_API_KEY,
       },
     });
   ```

4. **No restart needed** - Turborepo watches `.env.local` files automatically

## Benefits

### ✅ Single Source of Truth
- All environment variables in one place (root `.env.local`)
- Easy to manage and update
- Clear overview of all required configurations

### ✅ Type-Safe Access
- Each package validates only what it needs
- TypeScript autocomplete for environment variables
- Runtime validation prevents errors

### ✅ Zero Configuration
- Turborepo automatically passes variables down
- No need to duplicate `.env` files in each package
- Works seamlessly with `pnpm dev`, `pnpm build`, etc.

### ✅ Flexible
- Packages can still have local `.env.local` if needed (like database)
- Apps can override with their own `.env.local`
- Easy to add new variables without changing infrastructure

## Troubleshooting

### Environment variable not found

1. Check that it's defined in root `.env.local`
2. Verify it's added to the package's `keys.ts` runtimeEnv mapping
3. Restart the dev server (`pnpm dev`)

### Prisma can't find DATABASE_URL

The `packages/database/.env.local` file should contain `DATABASE_URL`. This is loaded explicitly by `prisma.config.ts`.

### Variable shows as undefined

Ensure the variable is:
1. Present in root `.env.local`
2. Mapped in the package's `keys.ts` file
3. Not overridden by a local `.env.local` in the package/app

## Security Notes

- **Never commit `.env.local`** - it's in `.gitignore`
- Only commit `.env.example` files with empty values
- Use different values for development, staging, and production
- Rotate secrets regularly
- Use tools like [Doppler](https://www.doppler.com/) or [Infisical](https://infisical.com/) for team secret management

## References

- [Turborepo Environment Variables](https://turbo.build/repo/docs/core-concepts/monorepos/environment-variables)
- [T3 Env Documentation](https://env.t3.gg/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
