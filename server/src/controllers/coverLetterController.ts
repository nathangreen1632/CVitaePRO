import { Request, Response } from "express";
import { callOpenAI } from "../utils/openaiUtil.js";
import { coverLetterPrompt, userCoverLetterDirections } from "../prompts/coverLetterDirections.js";
import logger from "../register/logger.js"; // ✅ Use structured logging

export const generateCoverLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userInput, applicantDetails, resumeSummary, customizationPreferences } = req.body;

    // ✅ Validate required fields before proceeding
    if (!userInput?.jobTitle || !userInput?.companyName) {
      logger.warn("⚠️ Missing required job details:", userInput);
      res.status(400).json({ error: "Job title and company name are required." });
      return;
    }

    if (!applicantDetails?.name) {
      logger.warn("⚠️ Missing applicant name:", applicantDetails);
      res.status(400).json({ error: "Applicant name is required." });
      return;
    }

    if (!resumeSummary?.summary) {
      logger.warn("⚠️ Missing resume summary:", resumeSummary);
      res.status(400).json({ error: "Resume summary is required." });
      return;
    }

    logger.info("✅ All required fields validated. Proceeding with OpenAI request.");

    const messages = [
      { role: "system", content: coverLetterPrompt },
      {
        role: "user",
        content: `${userCoverLetterDirections}
        
        - Job Title: ${userInput.jobTitle}
        - Company: ${userInput.companyName}

        - Applicant Name: ${applicantDetails.name}
        - Contact Info: Email - ${applicantDetails.email}, Phone - ${applicantDetails.phone}, LinkedIn - ${applicantDetails.linkedin}, Portfolio - ${applicantDetails.portfolio}

        - Resume Summary: ${resumeSummary.summary}
        - Experience: ${JSON.stringify(resumeSummary.experience, null, 2)}
        - Education: ${JSON.stringify(resumeSummary.education, null, 2)}
        - Skills: ${resumeSummary.skills.join(", ")}
        - Certifications: ${JSON.stringify(resumeSummary.certifications, null, 2)}

        - Customization Preferences: ${customizationPreferences.tone}, ${customizationPreferences.length}, Focus Areas: ${customizationPreferences.focusAreas.join(", ")}
        `
      }
    ];

    const aiResponse = await callOpenAI({
      model: "gpt-4o",
      messages,
    });

    if (!aiResponse) {
      logger.error("❌ Failed to generate cover letter.");
      res.status(500).json({ error: "Failed to generate cover letter." });
      return;
    }

    logger.info("✅ Successfully generated cover letter.");
    res.status(200).json(aiResponse);
  } catch (error) {
    logger.error(`❌ Cover Letter Generation Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
