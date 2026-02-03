# AGENTS.md - Email Preview (apps/email)

## Overview

React Email development environment for previewing and testing email templates. Runs on port 3003.

## File Structure

```
apps/email/
├── package.json
└── (templates loaded from packages/email/templates)
```

## Commands

```bash
pnpm dev      # Start email preview server (port 3003)
pnpm build    # Build email templates
pnpm export   # Export templates to HTML
```

## Dependencies

### Internal Packages
- `@repo/email` - Email templates and Resend utilities

### Key External Dependencies
- `react-email` - Email development framework
- `@react-email/components` - Email-safe React components

## Key Patterns

### Template Location
Templates are stored in `packages/email/templates/` and loaded by this preview app.

### Development Workflow
1. Edit templates in `packages/email/templates/`
2. Preview changes at `http://localhost:3003`
3. Export to HTML when ready

### Email Components
Use `@react-email/components` for email-safe components:
- `Html`, `Head`, `Body`
- `Container`, `Section`, `Row`, `Column`
- `Text`, `Link`, `Button`
- `Img`, `Hr`

## Testing Templates

The preview server provides:
- Live reload on template changes
- Multiple email client previews
- Mobile/desktop viewport switching

## Security Considerations

- Never include real user data in preview templates
- Use placeholder content for development
- Resend API tokens only in `@repo/email` package
