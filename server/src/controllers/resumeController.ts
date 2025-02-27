import { RequestHandler } from "express";
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";

/**
 * Handles resume file upload and processing.
 */
export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(req.file.path);
    res.status(200).json(structuredResume);
  } catch (error) {
    console.error("Error processing uploaded resume:", error);
    res.status(500).json({ error: "Error processing resume file." });
  }
};

/**
 * Handles processing a resume that was already uploaded.
 * Extracts content from a file and converts it into structured data.
 */
export const processResume: RequestHandler = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      res.status(400).json({ error: "Missing file path." });
      return;
    }

    // ✅ Parses resume from PDF (no OpenAI interaction)
    const structuredResume = await parseResumeFromPDF(filePath);

    res.status(200).json(structuredResume);
  } catch (error) {
    console.error("Error processing resume data:", error);
    res.status(500).json({ error: "Error processing resume data." });
  }
};
