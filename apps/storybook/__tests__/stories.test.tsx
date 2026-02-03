import { composeStories } from "@storybook/react";
import { render, cleanup } from "@testing-library/react";
import { describe, expect, test, afterEach } from "vitest";
import * as ButtonStories from "../stories/button.stories";
import * as BadgeStories from "../stories/badge.stories";
import * as AlertStories from "../stories/alert.stories";

afterEach(() => {
  cleanup();
});

describe("Button Stories", () => {
  const { Default, Outline, Destructive, Secondary, Ghost, Link } =
    composeStories(ButtonStories);

  test("renders Default button", () => {
    const { container } = render(<Default />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
    expect(button?.textContent).toContain("Button");
  });

  test("renders Outline button", () => {
    const { container } = render(<Outline />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  test("renders Destructive button", () => {
    const { container } = render(<Destructive />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  test("renders Secondary button", () => {
    const { container } = render(<Secondary />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  test("renders Ghost button", () => {
    const { container } = render(<Ghost />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  test("renders Link button", () => {
    const { container } = render(<Link />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });
});

describe("Badge Stories", () => {
  const { Default, Secondary, Destructive, Outline } =
    composeStories(BadgeStories);

  test("renders Default badge", () => {
    const { container } = render(<Default />);
    expect(container.firstChild).toBeDefined();
  });

  test("renders Secondary badge", () => {
    const { container } = render(<Secondary />);
    expect(container.firstChild).toBeDefined();
  });

  test("renders Destructive badge", () => {
    const { container } = render(<Destructive />);
    expect(container.firstChild).toBeDefined();
  });

  test("renders Outline badge", () => {
    const { container } = render(<Outline />);
    expect(container.firstChild).toBeDefined();
  });
});

describe("Alert Stories", () => {
  const { Default, Destructive } = composeStories(AlertStories);

  test("renders Default alert", () => {
    const { container } = render(<Default />);
    expect(container.querySelector('[role="alert"]')).toBeDefined();
  });

  test("renders Destructive alert", () => {
    const { container } = render(<Destructive />);
    expect(container.querySelector('[role="alert"]')).toBeDefined();
  });
});
