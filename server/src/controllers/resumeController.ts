import { Request, Response, RequestHandler } from "express";
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import { generateFromOpenAI } from "../services/openaiService.js";

/**
 * Handles resume generation requests.
 */
export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      res.status(400).json({ error: "Resume data is required" });
      return;
    }

    const markdownResume = await generateFromOpenAI("resume", resumeData);
    res.json({ markdownResume });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate resume" });
  }
};

/**
 * Handles resume file upload and processing.
 */
export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) { // ✅ No more TypeScript error
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(req.file.path);
    res.status(200).json(structuredResume);
  } catch (error) {
    res.status(500).json({ error: "Error processing resume file." });
  }
};

/**
 * Handles processing a resume that was already uploaded.
 */
export const processResume: RequestHandler = async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      res.status(400).json({ error: "Missing file path." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(filePath);
    res.status(200).json(structuredResume);
  } catch (error) {
    res.status(500).json({ error: "Error processing resume data." });
  }
};
