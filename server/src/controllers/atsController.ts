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

    // ✅ Generate a unique cache key based on resume and job description
    const cacheKey = `atsScore:${Buffer.from(htmlResume + jobDescription).toString("base64")}`;

    // ✅ Check Redis cache first
    const cachedATSScore = await getCachedResponse(cacheKey);
    if (cachedATSScore) {
      logger.info("✅ Returning ATS score from cache");
      res.status(200).json(cachedATSScore);
      return;
    }

    // Step 1: Parse the resume
    const parsedResume = parseResume(htmlResume);

// ✅ Fix: Check for missing name before using it
    if (!parsedResume.name || parsedResume.name.trim() === "") {
      logger.warn("⚠️ Name was not detected. Using fallback processing...");

      // ✅ Attempt to extract name manually
      const nameMatch = htmlResume.match(/Name:\s*([A-Za-z\s-]+)/i);
      parsedResume.name = nameMatch ? nameMatch[1].trim() : "Unknown Candidate";

      logger.warn(`⚠️ Fallback name assigned: ${parsedResume.name}`);
    }


// Continue with Redis caching and ATS scoring as usual...


    // 🔍 Debug Log: Print Extracted Name Before Scoring
    logger.info(`🔍 Extracted Name from Resume: '${parsedResume.name}'`);

    // 🔍 If Name is Missing, Log Raw Resume Data for Debugging
    if (!parsedResume.name || parsedResume.name.trim() === "") {
      logger.warn("⚠️ No name extracted. Logging raw resume text for debugging.");
      logger.warn(htmlResume);
    }

    // Step 2: Identify formatting errors
    const formattingErrors: string[] = [];
    if (!parsedResume.name || parsedResume.name.trim().toLowerCase() === "unknown candidate") {
      formattingErrors.push("Missing name.");
    }
    if (!parsedResume.email) formattingErrors.push("Missing email.");
    if (!parsedResume.phone) formattingErrors.push("Missing phone number.");


    // Step 3: Match keywords, soft skills, and industry terms
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


    // Step 4: Calculate ATS score
    const atsScore = calculateATSScore(keywordMatch, formattingErrors, softSkillsMatch, industryTermsMatch);

    // ✅ Store the ATS score in Redis for 24 hours
    await setCachedResponse(cacheKey, { atsScore, keywordMatch, softSkillsMatch, industryTermsMatch, formattingErrors }, 86400);

    res.status(200).json({ atsScore, keywordMatch, softSkillsMatch, industryTermsMatch, formattingErrors });
  } catch (error) {
    logger.error("❌ Error calculating ATS Score:", error);
    res.status(500).json({ success: false, message: "Failed to calculate ATS Score" });
  }
};
