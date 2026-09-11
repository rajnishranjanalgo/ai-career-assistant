"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

type ResumeAnalysis = {
  score: number;
  targetRole: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
};

function ResumeAnalysisCard({
  result,
}: {
  result: ResumeAnalysis;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-blue-500/30 bg-slate-950 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            Resume Analysis
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Target role: {result.targetRole}
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-blue-500">
          <span className="text-xl font-bold text-blue-400">
            {result.score}
          </span>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-slate-900 p-3 text-sm leading-6 text-slate-300">
        {result.summary}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-green-400">
            Strengths
          </h4>

          <ul className="space-y-2 text-sm text-slate-300">
            {result.strengths.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-yellow-400">
            Weaknesses
          </h4>

          <ul className="space-y-2 text-sm text-slate-300">
            {result.weaknesses.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-yellow-400">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-2 font-semibold text-blue-400">
          Recommendations
        </h4>

        <ul className="space-y-2 text-sm text-slate-300">
          {result.recommendations.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-blue-400">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading =
    status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isLoading) {
      return;
    }

    sendMessage({
      text,
    });

    setInput("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold">
            CareerGuide AI
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Your AI assistant for career planning, resumes and
            interviews.
          </p>
        </header>

        {/* Chat Area */}
        <section
          aria-label="Career assistant conversation"
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {messages.length === 0 && (
            <div className="mx-auto mt-16 max-w-xl text-center">
              <h2 className="text-xl font-semibold">
                How can I help your career?
              </h2>

              <p className="mt-3 text-slate-400">
                Ask me about resumes, interviews, career paths or
                skills to learn.
              </p>

              <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      "How can I improve my resume as a fresher?"
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Improve my resume
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      "Give me a 3-month roadmap to prepare for software engineering interviews."
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Interview roadmap
                </button>
              </div>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-700 bg-slate-900 text-slate-100"
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">
                    {message.role === "user"
                      ? "You"
                      : "CareerGuide"}
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-6">
                    {message.parts.map((part, index) => {
                      {/* Normal AI text */}
                      if (part.type === "text") {
                        return (
                          <span key={index}>
                            {part.text}
                          </span>
                        );
                      }

                      {/* FE-07 Resume Analysis Tool */}
                      if (
                        part.type ===
                        "tool-analyzeResume"
                      ) {
                        if (
                          part.state ===
                          "input-streaming"
                        ) {
                          return (
                            <div
                              key={index}
                              className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-400"
                            >
                              Preparing resume analysis...
                            </div>
                          );
                        }

                        if (
                          part.state ===
                          "input-available"
                        ) {
                          return (
                            <div
                              key={index}
                              className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-400"
                            >
                              Analyzing your resume...
                            </div>
                          );
                        }

                        if (
                          part.state ===
                          "output-available"
                        ) {
                          return (
                            <ResumeAnalysisCard
                              key={index}
                              result={
                                part.output as ResumeAnalysis
                              }
                            />
                          );
                        }

                        if (
                          part.state ===
                          "output-error"
                        ) {
                          return (
                            <div
                              key={index}
                              role="alert"
                              className="mt-3 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-300"
                            >
                              Resume analysis failed. Please
                              try again.
                            </div>
                          );
                        }
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}

            {status === "submitted" && (
              <div
                className="flex justify-start"
                aria-live="polite"
                aria-label="CareerGuide is thinking"
              >
                <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  CareerGuide is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Input Area */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl gap-2"
          >
            <label
              htmlFor="career-message"
              className="sr-only"
            >
              Ask CareerGuide a question
            </label>

            <input
              id="career-message"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask about your career..."
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop AI response"
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            )}
          </form>

          <p className="mx-auto mt-2 max-w-3xl text-xs text-slate-500">
            AI-generated advice may not always be accurate.
            Verify important career decisions independently.
          </p>
        </div>
      </div>
    </main>
  );
}