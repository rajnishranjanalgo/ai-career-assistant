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

export async function POST(req: Request) {
  const { messages } = await req.json();

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
}