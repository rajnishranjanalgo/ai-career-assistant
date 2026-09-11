import {
  convertToModelMessages,
  stepCountIs,
  streamText,
} from "ai";

import {
  careerAssistantModel,
  SYSTEM_PROMPT,
} from "@/lib/ai";

import { analyzeResumeTool } from "@/lib/tools";

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Basic input protection to prevent oversized requests.
    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response("Too many messages", { status: 400 });
    }

    for (const message of messages) {
      if (!message || typeof message !== "object") {
        return new Response("Invalid message", { status: 400 });
      }

      if (Array.isArray(message.parts)) {
        for (const part of message.parts) {
          if (
            part?.type === "text" &&
            typeof part.text === "string" &&
            part.text.length > MAX_MESSAGE_LENGTH
          ) {
            return new Response("Message is too long", { status: 400 });
          }
        }
      }
    }

    const result = streamText({
      model: careerAssistantModel,

      system: `${SYSTEM_PROMPT}

You have access to an analyzeResume tool.

When the user asks you to analyze, review, score, or improve a resume and provides resume content, use the analyzeResume tool.

After receiving the tool result, briefly explain the result to the user.

Do not invent resume information that was not provided.`,

      messages: await convertToModelMessages(messages),

      tools: {
        analyzeResume: analyzeResumeTool,
      },

      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Chat request failed", { status: 500 });
  }
}