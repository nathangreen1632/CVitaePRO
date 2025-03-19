import { RequestHandler } from "express";
import { parseResume, matchKeywords, calculateATSScore } from "../services/atsService.js";
import { getCachedResponse, setCachedResponse } from "../services/cacheService.js";
import logger from "../register/logger.js"; // ✅ Use structured logging

export const getATSScore: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { htmlResume, jobDescription } = req.body;

    if (!htmlResume || !jobDescription) {
      res.status(400).json({ success: false, message: "Resume (HTML) and job description are required" });
      return;
    }

    const cacheKey = `atsScore:${Buffer.from(htmlResume + jobDescription).toString("base64")}`;

    const cachedATSScore = await getCachedResponse(cacheKey);
    if (cachedATSScore) {
      logger.info("✅ Returning ATS score from cache");
      res.status(200).json(cachedATSScore);
      return;
    }

    const parsedResume = parseResume(htmlResume);

    if (!parsedResume.name || parsedResume.name.trim() === "") {
      logger.warn("⚠️ Name was not detected. Using fallback processing...");

      const nameMatch = htmlResume.match(/Name:\s*([A-Za-z\s-]+)/i);
      parsedResume.name = nameMatch ? nameMatch[1].trim() : "Unknown Candidate";

      logger.warn(`⚠️ Fallback name assigned: ${parsedResume.name}`);
    }

    if (!parsedResume.name || parsedResume.name.trim() === "") {
      logger.warn("⚠️ No name extracted. Logging raw resume text for debugging.");
      logger.warn(htmlResume);
    }

    const formattingErrors: string[] = [];
    if (!parsedResume.name || parsedResume.name.trim().toLowerCase() === "unknown candidate") {
      formattingErrors.push("Missing name.");
    }
    if (!parsedResume.email) formattingErrors.push("Missing email.");
    if (!parsedResume.phone) formattingErrors.push("Missing phone number.");

    const resumeText = [
      parsedResume.name,
      parsedResume.email,
      parsedResume.phone,
      parsedResume.experience,
      parsedResume.education,
      parsedResume.skills
    ].filter(Boolean).join(" ");

    const { keywordMatch, softSkillsMatch, industryTermsMatch } = matchKeywords(
      resumeText,
      jobDescription
    );

    const atsScore = calculateATSScore(keywordMatch, formattingErrors, softSkillsMatch, industryTermsMatch);

    await setCachedResponse(cacheKey, { atsScore, keywordMatch, softSkillsMatch, industryTermsMatch, formattingErrors }, 1800);

    res.status(200).json({ atsScore, keywordMatch, softSkillsMatch, industryTermsMatch, formattingErrors });
  } catch (error) {
    logger.error("❌ Error calculating ATS Score:", error);
    res.status(500).json({ success: false, message: "Failed to calculate ATS Score" });
  }
};
