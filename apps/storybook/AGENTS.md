# AGENTS.md - Storybook (apps/storybook)

## Overview

Component development and documentation environment using Storybook. Runs on port 6006.

## File Structure

```
apps/storybook/
├── .storybook/         # Storybook configuration
├── stories/            # Component stories
├── package.json
└── README.md
```

## Commands

```bash
pnpm dev        # Start Storybook dev server (port 6006)
pnpm build      # Build static Storybook
pnpm chromatic  # Run visual regression tests
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Internal Packages
- `@repo/design-system` - UI components to document

### Key External Dependencies
- `storybook` - Storybook 10.x
- `@storybook/nextjs` - Next.js integration
- `@storybook/react` - React renderer
- `chromatic` - Visual regression testing

## Key Patterns

### Story Structure
Stories follow Component Story Format (CSF):
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/design-system/components/ui/button";

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
```

### Theme Support
Stories support light/dark mode via `@storybook/addon-themes`.

### Visual Regression Testing
Chromatic integration for automated visual testing:
```bash
pnpm chromatic  # Runs with --exit-zero-on-changes
```

## Adding Stories

1. Create `ComponentName.stories.tsx` in `stories/`
2. Import component from `@repo/design-system`
3. Define meta with component reference
4. Export story variants

## Configuration

### .storybook/main.ts
- Framework: `@storybook/nextjs`
- Addons: themes, onboarding

### .storybook/preview.ts
- Global decorators
- Theme configuration
- Viewport settings

## Security Considerations

- No real API calls in stories
- Mock all external dependencies
- Use placeholder data only
