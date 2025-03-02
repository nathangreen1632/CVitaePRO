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

    // ✅ Step 1: Check Redis Cache
    const cachedResume = await redisClient.get(cacheKey);
    if (cachedResume) {
      console.log("✅ Cache hit! Returning parsed cached resume.");
      res.status(200).json({ resume: JSON.parse(cachedResume) });
      return;
    }

    console.log("⚠️ Nothing in cache! Generating new resume via OpenAI...");
    const aiResponse = await generateFromOpenAI(req.user?.id || "guest", "resume", resumeData);


    if (!aiResponse.success) {
      res.status(500).json({ error: aiResponse.message });
      return;
    }

    // ✅ Convert Markdown to JSON before caching
    const formattedResume = parseResumeMarkdown(aiResponse.message, req.body.resumeData);

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

