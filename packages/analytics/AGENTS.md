# AGENTS.md - Analytics Package (@repo/analytics)

## Overview

Analytics integration combining PostHog for product analytics and Google Analytics for web analytics.

## File Structure

```
packages/analytics/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
├── posthog/            # PostHog client and provider
├── google/             # Google Analytics integration
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `posthog-js` - PostHog browser client
- `posthog-node` - PostHog server client
- `@next/third-parties` - Google Analytics
- `@vercel/analytics` - Vercel Analytics

## Environment Variables

**All client-side (public):**
```
NEXT_PUBLIC_POSTHOG_KEY           # PostHog project key (starts with phc_)
NEXT_PUBLIC_POSTHOG_HOST          # PostHog host URL
NEXT_PUBLIC_GA_MEASUREMENT_ID     # Google Analytics ID (starts with G-, optional)
```

From `keys.ts`:
```typescript
client: {
  NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith("phc_"),
  NEXT_PUBLIC_POSTHOG_HOST: z.url(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith("G-").optional(),
}
```

## Key Patterns

### PostHog Client-side
```typescript
import { usePostHog } from "@repo/analytics";

const posthog = usePostHog();
posthog.capture("event_name", { property: "value" });
```

### PostHog Server-side
```typescript
import { PostHogClient } from "@repo/analytics";

const client = PostHogClient();
client.capture({
  distinctId: userId,
  event: "server_event",
});
```

### Google Analytics
Automatically included via `@next/third-parties` when `GA_MEASUREMENT_ID` is set.

### Analytics Provider
Include in your app's layout:
```typescript
import { AnalyticsProvider } from "@repo/analytics";

<AnalyticsProvider>
  {children}
</AnalyticsProvider>
```

## Event Tracking Best Practices

1. Use descriptive, snake_case event names
2. Include relevant properties for context
3. Track both client and server events where appropriate
4. Use feature flags via PostHog for A/B testing

## Security Considerations

- PostHog keys are client-side but scoped to specific projects
- Never track PII (emails, names) without user consent
- Use PostHog's data anonymization features
- Server-side tracking for sensitive events
- Review PostHog's data retention settings
