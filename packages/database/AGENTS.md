# AGENTS.md - Database Package (@repo/database)

## Overview

Prisma database client and schema management with Neon PostgreSQL adapter.

## File Structure

```
packages/database/
├── prisma/
│   └── models/         # Prisma schema files (multi-file schema)
├── generated/
│   └── prisma/         # Generated Prisma client
├── index.ts            # Main export (database client)
├── keys.ts             # Environment variable validation
├── prisma.config.ts    # Prisma configuration
└── package.json
```

## Commands

```bash
pnpm build      # Generate Prisma client
pnpm analyze    # Generate Prisma client (alias)
pnpm typecheck  # TypeScript type checking

# From monorepo root:
pnpm migrate    # Format, generate, and push schema
```

## Dependencies

### Key External Dependencies
- `@prisma/client` - Prisma ORM client (v7.x)
- `@prisma/adapter-neon` - Neon serverless adapter
- `@neondatabase/serverless` - Neon serverless driver
- `ws` - WebSocket support for Neon

## Environment Variables

**Required:**
```
DATABASE_URL    # PostgreSQL connection string (validated as URL)
```

From `keys.ts`:
```typescript
server: {
  DATABASE_URL: z.url(),
}
```

## Key Patterns

### Database Client Export
```typescript
import { database } from "@repo/database";

const users = await database.user.findMany();
```

### Multi-File Schema
Prisma schemas are split across files in `prisma/models/`:
- Enables better organization for large schemas
- Each file can contain related models

### Neon Serverless Adapter
The client uses Neon's serverless adapter for edge compatibility:
```typescript
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";
```

## Local Development

Start local PostgreSQL:
```bash
docker compose up -d
```

Set `DATABASE_URL` to local instance:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/next-forge"
```

## Schema Changes

1. Edit schema files in `prisma/models/`
2. Run `pnpm migrate` from monorepo root
3. Generated client updates automatically

## Security Considerations

- `DATABASE_URL` contains credentials - NEVER log or expose
- Use connection pooling in production
- Server-only package (`server-only` import)
- Never import database client in client components
