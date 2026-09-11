# CareerGuide AI

CareerGuide AI is an AI-powered career assistant for students and job seekers.

It helps users with career planning, resume improvement, interview preparation, skills and learning roadmaps, and job-search preparation.

## Live Demo

https://ai-career-assistant-mocha.vercel.app

## Features

### AI Career Assistant

Ask CareerGuide questions about:

- Career planning
- Resume improvement
- Interview preparation
- Skills to learn
- Learning roadmaps
- Job-search preparation

The assistant provides practical, beginner-friendly responses through a streaming chat interface.

### Resume Analysis

CareerGuide includes an AI-powered `analyzeResume` tool that evaluates resume content and returns a structured analysis containing:

- Resume score
- Target role
- Strengths
- Weaknesses
- Recommendations
- Summary

The result is displayed using a dedicated UI component.

### Interview Preparation

Users can ask the AI for:

- Interview questions
- Preparation strategies
- Technical interview guidance
- Behavioral interview guidance
- Interview roadmaps

### Error and Loading States

The application handles common AI interaction states:

- Loading / thinking state
- Streaming response state
- API errors
- Retry functionality
- Empty state
- Stop response button

## Screenshots

### CareerGuide AI

The application provides a responsive career assistant interface with suggested actions and an AI chat experience.

![CareerGuide AI](./audit-screenshots/lighthouse-mobile-after.png)

### Accessibility Audit

WAVE reported zero errors, zero contrast errors, and zero alerts.

![WAVE Accessibility Audit](./audit-screenshots/wave-accessibility.png)

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Vercel
- Vercel AI SDK
- Google Gemini
- Zod
- Vitest
- React Testing Library
- Playwright

## Architecture

```text
User
  |
  v
Next.js Frontend
  |
  v
AI Chat API
/src/app/api/chat/route.ts
  |
  +--------------------+
  |                    |
  v                    v
Google Gemini       analyzeResume
AI Model              Tool
  |                    |
  +---------+----------+
            |
            v
     Streaming Response
            |
            v
       Chat Interface