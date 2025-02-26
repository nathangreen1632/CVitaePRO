import { Request, Response } from "express";
import { generateFromOpenAI } from "../services/openaiService.js";
import { generateCoverLetter } from "./coverLetterController.js";
import redisClient from "../services/cacheService.js";

export const generateResume = async (req: Request, res: Response): Promise<void> => { // ✅ Explicitly return void
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      res.status(400).json({ error: "Missing resume data" });
      return; // ✅ Ensure function stops execution here
    }

    const cacheKey = `resume:${Buffer.from(JSON.stringify(resumeData)).toString("base64")}`;
    console.log("🔍 Checking Redis for cache:", cacheKey);

    // Check Redis Cache
    const cachedResume = await redisClient.get(cacheKey);
    if (cachedResume) {
      console.log("✅ Cache hit! Returning cached resume.");
      res.status(200).json({ resume: JSON.parse(cachedResume) });
      return; // ✅ Prevents multiple res.json() calls
    }

    console.log("⚠️ Cache miss! Generating new resume via OpenAI...");
    const enhancedResume = await generateFromOpenAI("resume", resumeData);

    // Store in Redis
    await redisClient.set(cacheKey, JSON.stringify(enhancedResume), { EX: 86400 });
    console.log("📝 Resume stored in Redis for future use.");

    res.status(200).json({ resume: enhancedResume });
  } catch (error) {
    console.error("❌ Error generating resume:", error);

    if (!res.headersSent) { // ✅ Prevents duplicate response errors
      res.status(500).json({ error: "Failed to generate resume." });
    }
  }
};



/** Controller to handle cover letter generation requests. */
export const generateCoverLetterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      res.status(400).json({ error: "Missing input for cover letter." });
      return; // ✅ Stops execution
    }

    const cacheKey = `coverLetter:${Buffer.from(JSON.stringify(userInput)).toString("base64")}`;
    console.log("🔍 Checking Redis for cache:", cacheKey);

    // ✅ Step 1: Check Redis Cache
    const cachedCoverLetter: string | null = await redisClient.get(cacheKey);
    if (cachedCoverLetter) {
      console.log("✅ Cache hit! Returning cached cover letter.");
      res.status(200).json({ coverLetter: JSON.parse(cachedCoverLetter) });
      return; // ✅ Prevents multiple res.json() calls
    }

    console.log("⚠️ Cache miss! Generating new cover letter via OpenAI...");
    const coverLetter: string = await generateCoverLetter();

    // ✅ Step 2: Store in Redis
    await redisClient.set(cacheKey, JSON.stringify(coverLetter), { EX: 86400 });
    console.log("📝 Cover letter stored in Redis for future use.");

    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error("❌ Error generating cover letter:", error);

    if (!res.headersSent) { // ✅ Prevents duplicate response errors
      res.status(500).json({ error: "Failed to generate cover letter." });
    }
  }
};

