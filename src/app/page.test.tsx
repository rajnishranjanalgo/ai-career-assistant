import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

const {
  mockUseChat,
  mockSendMessage,
  mockClearError,
  mockRegenerate,
  mockStop,
} = vi.hoisted(() => ({
  mockUseChat: vi.fn(),
  mockSendMessage: vi.fn(),
  mockClearError: vi.fn(),
  mockRegenerate: vi.fn(),
  mockStop: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: mockUseChat,
}));

vi.mock("ai", () => ({
  DefaultChatTransport: class DefaultChatTransport {
    constructor() {}
  },
}));

vi.mock("@/components/AnimatedActionButton", () => ({
  default: () => <button>Generate</button>,
}));

function setupChat(overrides = {}) {
  mockUseChat.mockReturnValue({
    messages: [],
    sendMessage: mockSendMessage,
    status: "ready",
    stop: mockStop,
    error: null,
    regenerate: mockRegenerate,
    clearError: mockClearError,
    ...overrides,
  });
}

describe("CareerGuide chat UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChat();
  });

  it("shows the empty state when there are no messages", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "How can I help your career?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Ask me about resumes, interviews, career paths or skills to learn."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Improve my resume",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Interview roadmap",
      })
    ).toBeInTheDocument();
  });

  it("puts a suggestion into the chat input", () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Improve my resume",
      })
    );

    const input = screen.getByRole("textbox", {
      name: "Ask CareerGuide a question",
    });

    expect(input).toHaveValue(
      "How can I improve my resume as a fresher?"
    );
  });

  it("renders both user and assistant messages", () => {
    setupChat({
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [
            {
              type: "text",
              text: "How should I prepare for interviews?",
            },
          ],
        },
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Start with data structures and common behavioral questions.",
            },
          ],
        },
      ],
    });

    render(<Home />);

    expect(screen.getByText("You")).toBeInTheDocument();

    expect(
      screen.getByText("CareerGuide")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "How should I prepare for interviews?"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Start with data structures and common behavioral questions."
      )
    ).toBeInTheDocument();
  });

  it("shows the thinking state while the AI request is submitted", () => {
    setupChat({
      status: "submitted",
    });

    render(<Home />);

    expect(
      screen.getByLabelText(
        "CareerGuide is thinking"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "CareerGuide is thinking..."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Stop AI response",
      })
    ).toBeInTheDocument();
  });

  it("shows the error state and retries the failed request", () => {
    setupChat({
      status: "error",
      error: new Error("API request failed"),
    });

    render(<Home />);

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Something went wrong"
    );

    expect(
      screen.getByText(
        "CareerGuide could not complete your request. Please try again."
      )
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      })
    );

    expect(
      mockClearError
    ).toHaveBeenCalledTimes(1);

    expect(
      mockRegenerate
    ).toHaveBeenCalledTimes(1);
  });

  it("renders the resume analysis tool result", () => {
    setupChat({
      messages: [
        {
          id: "assistant-tool",
          role: "assistant",
          parts: [
            {
              type: "tool-analyzeResume",
              state: "output-available",
              output: {
                score: 85,
                targetRole: "Frontend Developer",
                strengths: [
                  "Strong project experience.",
                  "Technical skills are clearly listed.",
                ],
                weaknesses: [
                  "Some achievements could be quantified.",
                ],
                recommendations: [
                  "Add measurable results to project bullets.",
                ],
                summary:
                  "Your resume has a good foundation but can be improved.",
              },
            },
          ],
        },
      ],
    });

    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "Resume Analysis",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Target role: Frontend Developer"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("85")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Strong project experience."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Some achievements could be quantified."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Add measurable results to project bullets."
      )
    ).toBeInTheDocument();
  });
});