# AGENTS.md - Documentation (apps/docs)

## Overview

Mintlify-powered documentation site. Runs on port 3004.

## File Structure

```
apps/docs/
├── mint.json           # Mintlify configuration
├── content/            # Documentation content (MDX)
└── package.json
```

## Commands

```bash
pnpm dev    # Start Mintlify dev server (port 3004)
pnpm lint   # Check for broken links
```

## Key Patterns

### Content Structure
- Documentation written in MDX format
- Organized by feature/section in `content/` directory
- Navigation configured in `mint.json`

### Mintlify Configuration
The `mint.json` file controls:
- Navigation structure
- Theme and branding
- API reference settings
- Search configuration

## Adding Documentation

1. Create MDX file in appropriate `content/` subdirectory
2. Add frontmatter with title and description
3. Update `mint.json` navigation if needed
4. Run `pnpm lint` to verify links

## Security Considerations

- No sensitive information in documentation
- API examples should use placeholder values
- Environment variable names documented, not values
