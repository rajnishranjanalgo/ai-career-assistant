import { tool } from "ai";
import { z } from "zod";

export const analyzeResumeTool = tool({
  description:
    "Analyze a student's resume for career readiness. Use this when the user asks to analyze, review, improve, or score their resume.",

  inputSchema: z.object({
    resumeText: z
      .string()
      .min(50)
      .describe("The complete resume text provided by the user."),

    targetRole: z
      .string()
      .default("software developer")
      .describe("The job role the user is targeting."),
  }),

  execute: async ({ resumeText, targetRole }) => {
    const text = resumeText.toLowerCase();

    let score = 50;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Contact/profile links
    if (
      text.includes("@") &&
      (text.includes("linkedin") || text.includes("github"))
    ) {
      score += 10;
      strengths.push(
        "Includes useful professional contact or profile links."
      );
    } else {
      score -= 5;
      weaknesses.push(
        "Professional contact or profile links may be missing."
      );
    }

    // Projects
    if (text.includes("project") || text.includes("projects")) {
      score += 10;
      strengths.push("Includes project experience.");
    } else {
      score -= 10;
      weaknesses.push("Projects are not clearly mentioned.");
      recommendations.push(
        "Add 2–3 relevant projects with technologies and measurable results."
      );
    }

    // Technical skills
    if (text.includes("skills") || text.includes("typescript")) {
      score += 10;
      strengths.push("Technical skills are present.");
    } else {
      weaknesses.push(
        "Technical skills section is not clearly visible."
      );
      recommendations.push(
        "Add a focused technical skills section relevant to the target role."
      );
    }

    // Experience
    if (
      text.includes("experience") ||
      text.includes("internship") ||
      text.includes("developer")
    ) {
      score += 10;
      strengths.push("Shows relevant experience or development work.");
    } else {
      weaknesses.push(
        "Relevant experience is limited or unclear."
      );
      recommendations.push(
        "Add internships, practical work, freelance work, or relevant development experience."
      );
    }

    // Education
    if (
      text.includes("education") ||
      text.includes("b.tech") ||
      text.includes("bachelor")
    ) {
      score += 5;
      strengths.push("Education information is included.");
    } else {
      recommendations.push("Add a concise education section.");
    }

    // Target role
    if (text.includes(targetRole.toLowerCase())) {
      score += 5;
      strengths.push(
        `Resume contains keywords related to ${targetRole}.`
      );
    } else {
      recommendations.push(
        `Tailor the resume more closely to the ${targetRole} role using relevant keywords.`
      );
    }

    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    if (recommendations.length === 0) {
      recommendations.push(
        "Quantify achievements and keep each bullet focused on impact."
      );
    }

    if (weaknesses.length === 0) {
      weaknesses.push(
        "No major structural weakness detected by the basic resume checker."
      );
    }

    return {
      score,
      targetRole,
      strengths,
      weaknesses,
      recommendations,
      summary:
        score >= 80
          ? "Your resume has a strong foundation and is close to job-ready."
          : score >= 60
            ? "Your resume has a good foundation but needs some improvements."
            : "Your resume needs several improvements before applying broadly.",
    };
  },
});