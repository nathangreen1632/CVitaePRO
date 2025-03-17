import { Request, Response } from "express";
import { generateFromOpenAI } from "../services/openaiService.js";
import redisClient from "../services/cacheService.js";
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js"; // ✅ Correct Import
import { saveToPostgreSQL } from "../services/postgreSQLService.js";
import crypto from "crypto";
export { expandResumeEditorContent } from "../services/openaiService.js"; // adjust path if needed


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
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized. Missing valid user session." });
      return;
    }

    const aiResponse = await generateFromOpenAI(req.user.id, "resume", resumeData);

    // // DEV MODE ONLY: override user ID manually
    // const userId = req.user?.id ?? "dev-user-override-id";
    // const aiResponse = await generateFromOpenAI(userId, "resume", resumeData);


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

    const resumeHash = crypto.createHash("sha256").update(aiResponse.message).digest("hex");
    await saveToPostgreSQL(resumeHash, aiResponse.message, req.user?.id ?? "guest", formattedResume);


    res.status(200).json({ resume: formattedResume });
  } catch (error) {
    console.error("❌ Error generating resume:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate resume." });
    }
  }
};

