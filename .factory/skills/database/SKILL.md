---
name: database
description: Manage database schema and migrations with Prisma
---

# Database Skill

This skill helps manage the database schema and migrations using Prisma.

## Database Setup

The project uses PostgreSQL with Prisma ORM. The database runs in Docker for local development.

### Start Database
```bash
docker compose up -d
```

### Connection String
Default local connection: `postgresql://postgres:postgres@localhost:5435/nextforge`

## Prisma Commands

### Apply Schema Changes
```bash
pnpm migrate
```
This runs: `prisma format && prisma generate && prisma db push`

### Generate Prisma Client
```bash
cd packages/database && npx prisma generate
```

### Open Prisma Studio (GUI)
```bash
cd packages/database && npx prisma studio
```

### Reset Database
```bash
cd packages/database && npx prisma db push --force-reset
```

## Schema Location

Schema files are in `packages/database/prisma/models/`:
- `schema.prisma` - Main schema file with generator and datasource config

## Adding a New Model

1. Edit `packages/database/prisma/models/schema.prisma`:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Apply changes:
```bash
pnpm migrate
```

3. Use in code:
```typescript
import { database } from "@repo/database";

const users = await database.user.findMany();
```

## Generated Client Location

The Prisma client is generated to: `packages/database/generated/prisma`
