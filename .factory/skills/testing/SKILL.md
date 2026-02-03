---
name: testing
description: Run and write tests for next-forge applications
---

# Testing Skill

This skill helps run and write tests for next-forge applications.

## Test Commands

### Unit Tests (Vitest)
```bash
# Run all unit tests
pnpm test

# Run tests for specific app
cd apps/app && pnpm test
cd apps/api && pnpm test
cd apps/storybook && pnpm test

# Run with coverage
cd apps/app && pnpm test --coverage
```

### E2E Tests (Playwright)
```bash
# Run all E2E tests
pnpm e2e

# Run with UI
pnpm e2e:ui

# Run headed (visible browser)
pnpm e2e:headed

# Run specific test file
pnpm e2e e2e/home.spec.ts
```

## Test File Locations

| App | Unit Tests | E2E Tests |
|-----|------------|-----------|
| app | `apps/app/__tests__/` | `e2e/` |
| api | `apps/api/__tests__/` | `e2e/` |
| storybook | `apps/storybook/__tests__/` | - |

## Writing Tests

### Unit Test Example (Vitest)
```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import MyComponent from "../components/MyComponent";

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeDefined();
  });
});
```

### E2E Test Example (Playwright)
```typescript
import { test, expect } from "@playwright/test";

test("user can navigate", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/next-forge/);
});
```

## Coverage Thresholds

Tests enforce 60% coverage thresholds for:
- Statements
- Branches
- Functions
- Lines
