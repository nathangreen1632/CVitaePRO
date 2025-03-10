import fetch from "node-fetch";
import crypto from "crypto";
import { OPENAI_KEY, OPENAI_URL } from "../config/env.js";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
import { userCoverLetterDirections } from "../prompts/coverLetterDirections.js";
import { getFromPostgreSQL, saveToPostgreSQL } from "./postgreSQLService.js";
import { getCachedResponse, setCachedResponse} from "./cacheService.js";
import {parseResumeMarkdown} from "../utils/parseResumeMarkdown.js";
import logger from "../register/logger.js"; // ✅ Use centralized logger

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
  content: CoverLetterContent | ResumeContent
): Promise<{ success: boolean; message: string }> => {
  try {
    logger.info("🟡 Checking for cached OpenAI response...");

    // ✅ Create a hash of the resume data to track changes
    const contentHash = crypto.createHash("sha256").update(JSON.stringify(content)).digest("hex");

    // ✅ Generate a unique cache key based on userId + resumeHash
    const cacheKey = `resume:${contentHash}`; // ❌ Remove userId from cache key


    // ✅ Check if the enhanced resume is already cached
    const cachedEnhanced = await getCachedResponse(cacheKey);
    if (cachedEnhanced) {
      logger.info("✅ Returning cached enhanced resume from Redis.");
      return { success: true, message: cachedEnhanced };
    }

    // ✅ Check the database for a cached response
    const cachedResponse = await getFromPostgreSQL(cacheKey);
    if (cachedResponse) {
      logger.info("✅ Returning cached OpenAI response.");
      return { success: true, message: cachedResponse };
    }

    logger.info("🟡 No cached response found. Sending request to OpenAI...");

    // ✅ Validate content structure before proceeding
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

    // ✅ Ensure OpenAI gets the full structured resume request
    const userMessage =
      type === "resume"
        ? `${userResumeDirections}\n\nResume Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Return the full resume in proper markdown format. Every section (Summary, Experience, Education, Skills, Certifications) must be present. If a section is missing data, use placeholder text instead of removing it.`
        : `${userCoverLetterDirections}\n\nCover Letter Data:\n${JSON.stringify(content, null, 2)}\n\n### INSTRUCTIONS: Ensure the response is formatted correctly in markdown.`;

    const requestBody = {
      model: "gpt-4o",
      response_format: { type: "text" }, // ✅ Return plain text response
      max_tokens: 4000, // ✅ Ensures enough space for complete resume
      temperature: 0.7, // ✅ Keeps responses structured and consistent
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

    // ✅ Send request to OpenAI API
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

    // ❌ Assign a test user ID in development mode only❌
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Development mode: Using a valid test user ID.");
      userId = "a6127972-0e36-4e91-b4b8-eccdcfc0c757"; // ❌ Remove this line in production
    }

    // ‼️ Include this block in production only ‼️
    // const userId = req.user?.id; // ✅ Use the real user ID from authentication
    // if (!userId) {
    //   return res.status(401).json({ error: "Unauthorized: Missing valid user session." });
    // }


    const parsedResume = parseResumeMarkdown(aiMessage, content);


    // ✅ Store the OpenAI response in PostgreSQL with the unique cache key
    await saveToPostgreSQL(contentHash, aiMessage, userId, parsedResume); // ✅ Correct order

    await setCachedResponse(cacheKey, aiMessage, 7200); // ✅ Cache response for 2 hours

    return { success: true, message: aiMessage };
  } catch (error) {
    logger.error("❌ Unexpected Error in generateFromOpenAI:", error);
    return { success: false, message: "Failed to generate response due to an internal error." };
  }
};
