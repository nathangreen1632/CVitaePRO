import fetch from "node-fetch";
import crypto from "crypto";
import { RequestHandler } from "express";
import { OPENAI_KEY, OPENAI_URL } from "../config/env.js";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
import { userCoverLetterDirections } from "../prompts/coverLetterDirections.js";
import { getFromPostgreSQL, saveToPostgreSQL } from "./postgreSQLService.js";
import { getCachedResponse, setCachedResponse } from "./cacheService.js";
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js";
import logger from "../register/logger.js";
import { callOpenAI } from "../utils/openaiUtil.js";
import { enhancePrompt } from "../prompts/enhancePrompt.js";

interface CoverLetterContent {
  userInput: { jobTitle: string; companyName: string };
  applicantDetails: { name: string; email?: string; phone?: string; linkedin?: string; portfolio?: string };
  resumeSummary: { summary: string; experience?: any[]; education?: any[]; skills?: string[]; certifications?: any[] };
  customizationPreferences: { tone: string; length: string; focusAreas: string[] };
}

interface ResumeContent {
  summary: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  certifications?: any[];
}

function isValidCoverLetterContent(content: any): content is CoverLetterContent {
  const { userInput, applicantDetails, resumeSummary } = content ?? {};
  if (!userInput?.jobTitle || !userInput?.companyName) {
    logger.error("Missing jobTitle or companyName in userInput:", userInput);
    return false;
  }
  if (!applicantDetails?.name) {
    logger.error("Missing applicant name:", applicantDetails);
    return false;
  }
  if (!resumeSummary?.summary) {
    logger.error("Missing resume summary:", resumeSummary);
    return false;
  }
  return true;
}

export const generateFromOpenAI = async (
  userId: string,
  type: "coverLetter" | "resume",
  content: CoverLetterContent | (ResumeContent & { jobDescription?: string })
): Promise<{ success: boolean; message: string }> => {
  try {
    const contentHash = crypto.createHash("sha256").update(JSON.stringify(content)).digest("hex");
    const cacheKey = `resume:${contentHash}`;

    const cached = await getCachedResponse(cacheKey) ?? await getFromPostgreSQL(cacheKey);
    if (cached) return { success: true, message: cached };

    if (!content || typeof content !== "object") {
      logger.error("Invalid content sent to OpenAI:", content);
      return { success: false, message: "Invalid request. Content must be a valid object." };
    }

    if (type === "coverLetter" && !isValidCoverLetterContent(content)) {
      return { success: false, message: "Missing required cover letter fields." };
    }

    const jobDescription = type === "resume" && "jobDescription" in content && content.jobDescription
      ? `\n\n### Target Job Description:\n${content.jobDescription}`
      : "";

    const userMessage =
      type === "resume"
        ? `${userResumeDirections}${jobDescription}\n\nResume Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Return the full resume in proper markdown format. Every section (Summary, Experience, Education, Skills, Certifications) must be present. If a section is missing data, use placeholder text instead of removing it. All compound words should be hyphenated (e.g. Full-Stack, Hands-on, etc), and ensure the response is formatted correctly in markdown.`
        : `${userCoverLetterDirections}\n\nCover Letter Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Ensure the response is formatted correctly in markdown. All compound words should be hyphenated. Return the cover letter in markdown format, ensuring it is well-structured and professional.`;

    const requestBody = {
      model: "gpt-4o",
      response_format: { type: "text" },
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `${resumePrompt}\n\nEnsure every resume section is preserved. If a section is empty, return it with placeholder text instead of removing it.`,
        },
        {
          role: "user",
          content: `### Input Data\n\n${userMessage}\n\n### FINAL INSTRUCTIONS:
            - Return the full resume in **markdown format**
            - Every section (Summary, Experience, Education, Skills, Certifications) must be present unless otherwise forbidden.
            - **All compound words MUST be hyphenated** (e.g. Full-Stack, Hands-on, High-Level, Results-Oriented, etc).
            - If a compound word is not hyphenated, **rephrase or fix it before finalizing the section.**
            - Do NOT add any section not present in the user data.
            - Do NOT use placeholder content in Education, Skills, or Certifications.
            - Ensure the resume is clean, professional, and ATS-optimized.`,
        },
      ],
    };

    const openAiResponse = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const jsonResponse = await openAiResponse.json();

    if (!openAiResponse.ok) {
      logger.error("OpenAI API Error:", jsonResponse);
      return { success: false, message: `OpenAI API Error: ${openAiResponse.status} ${JSON.stringify(jsonResponse)}` };
    }

    const aiMessage = jsonResponse.choices?.[0]?.message?.content ?? "Error: No valid response from OpenAI";

    if (process.env.NODE_ENV !== "production") {
      userId = "a6127972-0e36-4e91-b4b8-eccdcfc0c757";
    }

    const parsedResume = parseResumeMarkdown(aiMessage, content);
    await saveToPostgreSQL(contentHash, aiMessage, userId, parsedResume);
    await setCachedResponse(cacheKey, aiMessage, 7200);

    return { success: true, message: aiMessage };
  } catch (error) {
    logger.error("Unexpected Error in generateFromOpenAI:", error);
    return { success: false, message: "Failed to generate response due to an internal error." };
  }
};

export const expandResumeEditorContent: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== "string") {
      res.status(400).json({ error: "Missing or invalid raw text." });
      return;
    }

    const result = await expandResumeContent("editor", rawText);

    if (!result.success) {
      res.status(500).json({ error: result.message });
      return;
    }

    res.status(200).json({ enhancedText: result.message });
  } catch (error) {
    logger.error("Error expanding resume:", error);
    res.status(500).json({ error: "Server error while enhancing resume content." });
  }
};

export const expandResumeContent = async (
  _userId: string,
  rawText: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const fullPrompt = `${enhancePrompt}\n\n"""${rawText}"""`;

    return await callOpenAI({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a resume rewriting assistant." },
        { role: "user", content: fullPrompt },
      ],
    });
  } catch (error) {
    logger.error("expandResumeContent error:", error);
    return { success: false, message: "Failed to enhance content." };
  }
};
