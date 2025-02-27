import { RequestHandler } from "express";
import { parseResume, matchKeywords, calculateATSScore } from "../services/atsService.js";

export const getATSScore: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { htmlResume, jobDescription } = req.body;

    if (!htmlResume || !jobDescription) {
      res.status(400).json({ success: false, message: "Resume (HTML) and job description are required" });
      return;
    }

    // Step 1: Parse the resume
    const parsedResume = parseResume(htmlResume);

    // Step 2: Identify formatting errors (missing contact details)
    const formattingErrors: string[] = [];
    if (!parsedResume.name || parsedResume.name.trim() === "") formattingErrors.push("Missing name.");
    if (!parsedResume.email || parsedResume.email.trim() === "") formattingErrors.push("Missing email.");
    if (!parsedResume.phone || parsedResume.phone.trim() === "") formattingErrors.push("Missing phone number.");
    if (!parsedResume.experience || parsedResume.experience.trim() === "") formattingErrors.push("Missing experience section.");
    if (!parsedResume.education || parsedResume.education.trim() === "") formattingErrors.push("Missing education section.");
    if (!parsedResume.skills || parsedResume.skills.trim() === "") formattingErrors.push("Missing skills section.");

    console.log("Parsed Resume:", parsedResume);
    console.log("Formatting Errors Detected:", formattingErrors);

    // Step 3: Match keywords, soft skills, and industry terms
    const { keywordMatch, softSkillsMatch, industryTermsMatch } = matchKeywords(
      `${parsedResume.experience} ${parsedResume.education} ${parsedResume.skills}`,
      jobDescription
    );

    // Step 4: Calculate ATS score
    const atsScore = calculateATSScore(keywordMatch, formattingErrors, softSkillsMatch, industryTermsMatch);

    res.status(200).json({ success: true, atsScore, keywordMatch, softSkillsMatch, industryTermsMatch, formattingErrors, parsedResume });
  } catch (error) {
    console.error("Error calculating ATS Score:", error);
    res.status(500).json({ success: false, message: "Failed to calculate ATS Score" });
  }
};
