import { Request, Response } from "express";
import { generateFromOpenAI } from "../services/openaiService.js";
import redisClient from "../services/cacheService.js";
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js";
import { saveToPostgreSQL } from "../services/postgreSQLService.js";
import { sanitizeResumeForOpenAI } from "../utils/sanitizeResumeForOpenAI.js";
import crypto from "crypto";
export { expandResumeEditorContent } from "../services/openaiService.js";

const scrubCertificationsSection = (markdown: string): string => {
  return markdown.replace(/## Certifications[\s\S]*?(?=\n## |\n\*\*|$)/g, "").trim();
};

export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeData } = req.body;
    const sanitizedData = sanitizeResumeForOpenAI(resumeData);


    if (!resumeData) {
      res.status(400).json({ error: "Missing resume data" });
      return;
    }

    const cacheKey = `resume:${Buffer.from(JSON.stringify(resumeData)).toString("base64")}`;
    const cachedResume = await redisClient.get(cacheKey);

    if (cachedResume) {
      res.status(200).json({ resume: JSON.parse(cachedResume) });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized. Missing valid user session." });
      return;
    }

    const aiResponse = await generateFromOpenAI(req.user.id, "resume", sanitizedData);

    if (!aiResponse.success) {
      res.status(500).json({ error: aiResponse.message });
      return;
    }

    const aiRawMarkdown = aiResponse.message;
    const cleanedMarkdown = scrubCertificationsSection(aiRawMarkdown);
    const formattedResume = parseResumeMarkdown(cleanedMarkdown, req.body.resumeData);

    await redisClient.set(cacheKey, JSON.stringify(formattedResume), { EX: 86400 });

    const resumeHash = crypto.createHash("sha256").update(aiResponse.message).digest("hex");
        await saveToPostgreSQL(resumeHash, aiResponse.message, req.user?.id ?? "guest", formattedResume);

    res.status(200).json({ resume: formattedResume });
  } catch (error) {
    if (!res.headersSent) {
      console.error("Error generating resume:", error);
      res.status(500).json({ error: "Failed to generate resume." });
    }
  }
};
