import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AnimatedActionButton from "./AnimatedActionButton";

describe("AnimatedActionButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders the idle state by default", () => {
    render(<AnimatedActionButton />);

    expect(
      screen.getByRole("button", { name: "Generate" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Generate" })
    ).not.toBeDisabled();
  });

  it("shows the loading state after clicking", () => {
    render(<AnimatedActionButton />);

    const button = screen.getByRole("button", { name: "Generate" });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: "Working..." })
    ).toBeDisabled();
  });

  it("changes to success after the async action completes", async () => {
    render(<AnimatedActionButton mode="success" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(
      screen.getByRole("button", { name: "✓ Success" })
    ).toBeInTheDocument();
  });

  it("changes to error when error mode is selected", async () => {
    render(<AnimatedActionButton mode="error" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("returns to idle after a successful action", async () => {
    render(<AnimatedActionButton mode="success" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(
      screen.getByRole("button", { name: "✓ Success" })
    ).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1400);
    });

    expect(
      screen.getByRole("button", { name: "Generate" })
    ).toBeInTheDocument();
  });

  it("returns to idle after an error", async () => {
    render(<AnimatedActionButton mode="error" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1400);
    });

    expect(
      screen.getByRole("button", { name: "Generate" })
    ).toBeInTheDocument();
  });
});