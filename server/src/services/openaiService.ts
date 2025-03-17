import fetch from "node-fetch";
import crypto from "crypto";
import {RequestHandler} from "express"; // adjust path as needed
import { OPENAI_KEY, OPENAI_URL } from "../config/env.js";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
import { userCoverLetterDirections } from "../prompts/coverLetterDirections.js";
import { getFromPostgreSQL, saveToPostgreSQL } from "./postgreSQLService.js";
import { getCachedResponse, setCachedResponse} from "./cacheService.js";
import {parseResumeMarkdown} from "../utils/parseResumeMarkdown.js";
import logger from "../register/logger.js";
import {callOpenAI} from "../utils/openaiUtil.js"; // ✅ Use centralized logger
import { enhancePrompt } from "../prompts/enhancePrompt.js"; // ✅ Your requested import

// ✅ Define strict types for OpenAI content
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

export const generateFromOpenAI = async (
  userId: string,
  type: "coverLetter" | "resume",
  content: CoverLetterContent | ResumeContent & { jobDescription?: string } // ✅ added optional jobDescription
): Promise<{ success: boolean; message: string }> => {
  try {
    logger.info("🟡 Checking for cached OpenAI response...");

    const contentHash = crypto.createHash("sha256").update(JSON.stringify(content)).digest("hex");
    const cacheKey = `resume:${contentHash}`;

    const cachedEnhanced = await getCachedResponse(cacheKey);
    if (cachedEnhanced) {
      logger.info("✅ Returning cached enhanced resume from Redis.");
      return { success: true, message: cachedEnhanced };
    }

    const cachedResponse = await getFromPostgreSQL(cacheKey);
    if (cachedResponse) {
      logger.info("✅ Returning cached OpenAI response.");
      return { success: true, message: cachedResponse };
    }

    logger.info("🟡 No cached response found. Sending request to OpenAI...");

    if (!content || typeof content !== "object") {
      logger.error("❌ Invalid content sent to OpenAI:", content);
      return { success: false, message: "Invalid request. Content must be a valid object." };
    }

    if (type === "coverLetter") {
      const { userInput, applicantDetails, resumeSummary } = content as CoverLetterContent;
      if (!userInput?.jobTitle || !userInput?.companyName) {
        logger.error("❌ Missing jobTitle or companyName in userInput:", userInput);
        return { success: false, message: "Job title and company name are required." };
      }
      if (!applicantDetails?.name) {
        logger.error("❌ Missing applicant name:", applicantDetails);
        return { success: false, message: "Applicant name is required." };
      }
      if (!resumeSummary?.summary) {
        logger.error("❌ Missing resume summary:", resumeSummary);
        return { success: false, message: "Resume summary is required." };
      }
    }

    // ✅ Extract job description if provided (for resume generation)
    const jobDescription = type === "resume" && "jobDescription" in content && content.jobDescription
      ? `\n\n### Target Job Description:\n${content.jobDescription}`
      : "";

    const userMessage =
      type === "resume"
        ? `${userResumeDirections}${jobDescription}\n\nResume Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Return the full resume in proper markdown format. Every section (Summary, Experience, Education, Skills, Certifications) must be present. If a section is missing data, use placeholder text instead of removing it.`
        : `${userCoverLetterDirections}\n\nCover Letter Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Ensure the response is formatted correctly in markdown.`;

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
          content: `### Input Data\n\n${userMessage}\n\n### INSTRUCTIONS: Return the full resume in markdown format. Every section (Summary, Experience, Education, Skills, Certifications) must be present.`,
        },
      ],
    };

    logger.info("🟢 Sending request to OpenAI...");

    const openAiResponse = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const jsonResponse = await openAiResponse.json();
    logger.info("🔵 OpenAI Response:", JSON.stringify(jsonResponse, null, 2));

    if (!openAiResponse.ok) {
      logger.error("❌ OpenAI API Error:", jsonResponse);
      return { success: false, message: `OpenAI API Error: ${openAiResponse.status} ${JSON.stringify(jsonResponse)}` };
    }

    const aiMessage = jsonResponse.choices?.[0]?.message?.content || "Error: No valid response from OpenAI";

    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Development mode: Using a valid test user ID.");
      userId = "a6127972-0e36-4e91-b4b8-eccdcfc0c757";
    }

    // ‼️ Include this block in production only ‼️
    // const userId = req.user?.id; // ✅ Use the real user ID from authentication
    // if (!userId) {
    //   return res.status(401).json({ error: "Unauthorized: Missing valid user session." });
    // }

    const parsedResume = parseResumeMarkdown(aiMessage, content);

    await saveToPostgreSQL(contentHash, aiMessage, userId, parsedResume);
    await setCachedResponse(cacheKey, aiMessage, 7200);

    return { success: true, message: aiMessage };
  } catch (error) {
    logger.error("❌ Unexpected Error in generateFromOpenAI:", error);
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
    logger.error("❌ Error expanding resume:", error);
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
    logger.error("❌ expandResumeContent error:", error);
    return { success: false, message: "Failed to enhance content." };
  }
};
