# AGENTS.md - Email Package (@repo/email)

## Overview

Resend email service integration with React Email templates.

## File Structure

```
packages/email/
├── templates/          # React Email templates
├── index.ts            # Main exports (send function)
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking

# Preview templates (from apps/email):
cd apps/email && pnpm dev
```

## Dependencies

### Key External Dependencies
- `resend` - Email sending service
- `@react-email/components` - Email-safe React components

## Environment Variables

**Server-side (secret):**
```
RESEND_FROM     # Sender email address (validated as email)
RESEND_TOKEN    # Resend API token (starts with re_)
```

From `keys.ts`:
```typescript
server: {
  RESEND_FROM: z.string().email(),
  RESEND_TOKEN: z.string().startsWith("re_"),
}
```

## Key Patterns

### Sending Emails
```typescript
import { sendEmail } from "@repo/email";
import { WelcomeEmail } from "@repo/email/templates/welcome";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  react: WelcomeEmail({ name: "John" }),
});
```

### Creating Templates
Templates use React Email components:
```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hello {name}!</Text>
          <Button href="https://example.com">Get Started</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### Email-Safe Components
Only use `@react-email/components` for email templates:
- `Html`, `Head`, `Body`, `Preview`
- `Container`, `Section`, `Row`, `Column`
- `Text`, `Heading`, `Link`, `Button`
- `Img`, `Hr`

## Template Development

1. Create template in `packages/email/templates/`
2. Preview with `apps/email`: `cd apps/email && pnpm dev`
3. Test across email clients using preview tool
4. Export function with typed props

## Security Considerations

- `RESEND_TOKEN` is highly sensitive - never expose
- `RESEND_FROM` must be a verified domain in Resend
- Server-only package (`server-only` import)
- Sanitize any user-provided content in templates
- Never include sensitive data in email content
- Use template props, not database queries in templates
