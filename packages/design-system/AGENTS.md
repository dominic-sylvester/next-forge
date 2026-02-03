# AGENTS.md - Design System Package (@repo/design-system)

## Overview

UI component library built on shadcn/ui with 53+ components, providers, and shared styles.

## File Structure

```
packages/design-system/
├── components/
│   ├── ui/             # shadcn/ui components (53+ components)
│   └── mode-toggle.tsx # Theme toggle component
├── hooks/              # Shared React hooks
├── lib/                # Utility functions (cn, etc.)
├── providers/          # Context providers
├── styles/             # Global styles and Tailwind config
├── index.tsx           # Main exports
└── components.json     # shadcn/ui configuration
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking

# From monorepo root:
pnpm bump-ui    # Update shadcn/ui components
```

## Dependencies

### Internal Packages
- `@repo/auth` - For AuthProvider integration

### Key External Dependencies
- `radix-ui` - Headless UI primitives
- `class-variance-authority` - Variant management
- `clsx` + `tailwind-merge` - Class utilities
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `vaul` - Drawer component
- `cmdk` - Command palette
- `recharts` - Charts
- `react-day-picker` - Date picker
- `react-hook-form` - Form handling

## Key Patterns

### Component Imports
```typescript
import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardHeader, CardContent } from "@repo/design-system/components/ui/card";
```

### DesignSystemProvider
Wrap your app with the provider for full functionality:
```typescript
import { DesignSystemProvider } from "@repo/design-system";

<DesignSystemProvider>
  {children}
</DesignSystemProvider>
```

Includes:
- `ThemeProvider` (next-themes)
- `AuthProvider` (Clerk)
- `TooltipProvider` (Radix)
- `Toaster` (Sonner)

### Utility Function (cn)
```typescript
import { cn } from "@repo/design-system/lib/utils";

<div className={cn("base-class", conditional && "conditional-class")} />
```

## Component Style

- **Style**: "new-york" (shadcn/ui variant)
- **Base Color**: neutral
- **Border Radius**: 0.5rem default
- **CSS Variables**: Used for theming

## Adding Components

Use shadcn/ui CLI from monorepo root:
```bash
pnpm bump-ui
```

Or manually:
1. Copy component to `components/ui/`
2. Update imports to use `@repo/design-system/lib/utils`
3. Export from `index.tsx` if needed

## Available Components

Includes all standard shadcn/ui components:
- Layout: Card, Dialog, Drawer, Sheet, Tabs
- Forms: Button, Input, Select, Checkbox, Radio, Switch
- Data Display: Table, Avatar, Badge, Calendar
- Feedback: Alert, Toast, Progress, Skeleton
- Navigation: Breadcrumb, Menu, Command, Pagination
- And many more...

## Security Considerations

- No API calls within components
- Auth state accessed via `@repo/auth` hooks
- Client-side only - no server secrets
