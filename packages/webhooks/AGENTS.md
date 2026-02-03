# AGENTS.md - Webhooks Package (@repo/webhooks)

## Overview

Svix-powered webhook handling for both inbound (receiving) and outbound (sending) webhooks.

## File Structure

```
packages/webhooks/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
├── inbound/            # Receiving webhooks (from Clerk, Stripe, etc.)
├── outbound/           # Sending webhooks (to external services)
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Internal Packages
- `@repo/auth` - For webhook verification context

### Key External Dependencies
- `svix` - Webhook infrastructure

## Environment Variables

**Server-side (secret):**
```
SVIX_TOKEN    # Svix API token (starts with sk_ or testsk_, optional)
```

From `keys.ts`:
```typescript
server: {
  SVIX_TOKEN: z.union([
    z.string().startsWith("sk_"),
    z.string().startsWith("testsk_")
  ]).optional(),
}
```

## Key Patterns

### Receiving Webhooks (Inbound)

Verify incoming webhook signatures:
```typescript
import { Webhook } from "svix";

export async function POST(request: Request) {
  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id"),
    "svix-timestamp": request.headers.get("svix-timestamp"),
    "svix-signature": request.headers.get("svix-signature"),
  };

  const wh = new Webhook(process.env.WEBHOOK_SECRET);
  const event = wh.verify(payload, headers);
  
  // Process verified event...
}
```

### Sending Webhooks (Outbound)

Send webhooks to your customers:
```typescript
import { Svix } from "svix";

const svix = new Svix(process.env.SVIX_TOKEN);

await svix.message.create(appId, {
  eventType: "user.created",
  payload: { userId: "123" },
});
```

## Common Webhook Sources

- **Clerk**: User events (created, updated, deleted)
- **Stripe**: Payment events (checkout, subscription, invoice)
- **GitHub**: Repository events

## Webhook Endpoint Setup

1. Create API route in `apps/api/app/webhooks/[provider]/route.ts`
2. Verify signature using provider's verification method
3. Process event based on type
4. Return 200 status quickly (async processing if needed)

## Security Considerations

- `SVIX_TOKEN` is highly sensitive - never expose
- Always verify webhook signatures before processing
- Use separate webhook secrets per provider
- Log webhook events for debugging (without sensitive payload data)
- Implement idempotency to handle duplicate deliveries
- Return 200 quickly, process async if needed
- Never trust webhook payload without verification
