import { Request, Response } from "express";
import { generateFromOpenAI } from "../services/openaiService.js";
import redisClient from "../services/cacheService.js";
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js"; // ✅ Correct Import

/**
 * Handles resume generation via OpenAI.
 * Ensures responses are parsed into JSON before caching.
 */
export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      res.status(400).json({ error: "Missing resume data" });
      return;
    }

    const cacheKey = `resume:${Buffer.from(JSON.stringify(resumeData)).toString("base64")}`;
    console.log("🔍 Checking Redis for cache:", cacheKey);

    // ✅ Check Redis Cache
    const cachedResume = await redisClient.get(cacheKey);
    if (cachedResume) {
      console.log("✅ Cache hit! Returning parsed cached resume.");
      res.status(200).json({ resume: JSON.parse(cachedResume) });
      return;
    }

    console.log("⚠️ Cache miss! Generating new resume via OpenAI...");
    const openAiResponse = await generateFromOpenAI("resume", resumeData);

    // ✅ Convert Markdown to JSON before caching
    const formattedResume = parseResumeMarkdown(openAiResponse, req.body.resumeData);

    console.log("✅ Parsed Resume JSON:", formattedResume);

    // ✅ Store structured JSON in Redis
    await redisClient.set(cacheKey, JSON.stringify(formattedResume), { EX: 86400 });
    console.log("📝 Resume stored in Redis for future use.");

    res.status(200).json({ resume: formattedResume });
  } catch (error) {
    console.error("❌ Error generating resume:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate resume." });
    }
  }
};

/**
 * Handles cover letter generation via OpenAI.
 * Returns raw markdown (no JSON conversion needed).
 */
export const generateCoverLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      res.status(400).json({ error: "Missing input for cover letter." });
      return;
    }

    const cacheKey = `coverLetter:${Buffer.from(JSON.stringify(userInput)).toString("base64")}`;
    console.log("🔍 Checking Redis for cache:", cacheKey);

    // ✅ Step 1: Check Redis Cache
    const cachedCoverLetter: string | null = await redisClient.get(cacheKey);
    if (cachedCoverLetter) {
      console.log("✅ Cache hit! Returning cached cover letter.");
      res.status(200).json({ coverLetter: JSON.parse(cachedCoverLetter) });
      return;
    }

    console.log("⚠️ Cache miss! Generating new cover letter via OpenAI...");
    const coverLetter: string = await generateFromOpenAI("coverLetter", userInput);

    // ✅ Step 2: Store in Redis
    await redisClient.set(cacheKey, JSON.stringify(coverLetter), { EX: 86400 });
    console.log("📝 Cover letter stored in Redis for future use.");

    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error("❌ Error generating cover letter:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate cover letter." });
    }
  }
};
