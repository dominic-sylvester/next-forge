import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import GlobalError from "../app/global-error";

vi.mock("@repo/logger/client", () => ({
  createLogger: () => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock("@repo/design-system/lib/fonts", () => ({
  fonts: "mock-fonts",
}));

describe("GlobalError", () => {
  const mockError = {
    message: "Test error message",
    digest: "test-digest-123",
  } as Error & { digest: string };

  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("renders error page with try again button", () => {
    const resetMock = vi.fn();
    const { container } = render(
      <GlobalError error={mockError} reset={resetMock} />
    );

    expect(container.textContent).toContain("Oops, something went wrong");
    expect(container.textContent).toContain("Try again");
  });

  test("renders button element", () => {
    const resetMock = vi.fn();
    const { container } = render(
      <GlobalError error={mockError} reset={resetMock} />
    );

    const button = container.querySelector("button");
    expect(button).toBeDefined();
    expect(button?.textContent).toContain("Try again");
  });
});
