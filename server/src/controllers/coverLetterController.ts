import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { callOpenAI } from "../utils/openaiUtil.js";
import { coverLetterPrompt, userCoverLetterDirections } from "../prompts/coverLetterDirections.js";
import logger from "../register/logger.js";
import { generateCoverLetterDocx } from "../utils/docxUtil.js";

export const generateCoverLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userInput, applicantDetails, resumeSummary, customizationPreferences } = req.body;

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
      logger.warn("⚠️ Missing resume...:", resumeSummary);
      res.status(400).json({ error: "Resume is required." });
      return;
    }

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

    res.status(200).json({ coverLetter: aiResponse.message });
  } catch (error) {
    logger.error(`❌ Cover Letter Generation Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const downloadCoverLetter = (req: Request, res: Response): void => {
  const { coverLetter, name } = req.body;

  if (!coverLetter || typeof coverLetter !== "string") {
    logger.warn("⚠️ Missing or invalid cover letter text.");
    res.status(400).json({ error: "Missing or invalid cover letter text." });
    return;
  }

  logger.info("Generating PDF for cover letter download...");

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Cover_Letter_${name || "Applicant"}.pdf`
  );

  doc.pipe(res);
  doc.font("Times-Roman").fontSize(12).text(coverLetter, {
    align: "left",
    lineGap: 4,
  });
  doc.end();
};

export const downloadCoverLetterDocx = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coverLetter, name } = req.body;

    if (!coverLetter || !name) {
      res.status(400).json({ error: "Cover letter content and applicant name are required." });
      return;
    }

    const buffer = await generateCoverLetterDocx(coverLetter);
    const fileName = `Cover_Letter_${name.replace(/\s+/g, "_")}.docx`;

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.send(buffer);
  } catch (error) {
    logger.error("❌ Error generating .docx file:", error);
    res.status(500).json({ error: "Failed to generate .docx file." });
  }
};
