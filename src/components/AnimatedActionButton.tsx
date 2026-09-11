"use client";

import { useEffect, useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

type AnimatedActionButtonProps = {
  mode?: "success" | "error";
};

export default function AnimatedActionButton({
  mode = "success",
}: AnimatedActionButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");

  async function handleClick() {
    if (state === "loading") {
      return;
    }

    setState("loading");

    const delay = 900 + Math.random() * 700;

    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });

    setState(mode);

    setTimeout(() => {
      setState("idle");
    }, 1400);
  }

  useEffect(() => {
    if (state !== "error") {
      return;
    }

    const timer = setTimeout(() => {
      setState("idle");
    }, 1400);

    return () => clearTimeout(timer);
  }, [state]);

  const label =
    state === "loading"
      ? "Working..."
      : state === "success"
        ? "✓ Success"
        : state === "error"
          ? "Try again"
          : "Generate";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      aria-live="polite"
      className={`
        relative min-w-32 overflow-hidden rounded-xl px-5 py-3
        text-sm font-semibold text-white
        transition-all duration-300 ease-out
        transform
        hover:-translate-y-0.5
        active:translate-y-0
        focus:outline-none
        focus:ring-2 focus:ring-blue-400
        focus:ring-offset-2
        focus:ring-offset-slate-950
        disabled:cursor-wait
        disabled:opacity-90
        motion-reduce:transition-none
        motion-reduce:hover:transform-none
        ${
          state === "success"
            ? "bg-green-600 hover:bg-green-500"
            : state === "error"
              ? "bg-red-600 hover:bg-red-500 motion-safe:animate-[shake_0.35s_ease-in-out]"
              : "bg-blue-600 hover:bg-blue-500"
        }
      `}
    >
      <span
        className={`
          inline-flex items-center justify-center gap-2
          transition-all duration-200 ease-out
          motion-reduce:transition-none
        `}
      >
        {state === "loading" && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
          />
        )}

        <span>{label}</span>
      </span>
    </button>
  );
}