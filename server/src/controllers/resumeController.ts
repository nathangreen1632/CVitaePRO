import { RequestHandler } from "express";
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import { getCachedResponse, setCachedResponse } from "../services/cacheService.js"; // ✅ Import Redis
import logger from "../register/logger.js"; // ✅ Use structured logging

export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn("⚠️ No file uploaded in resume upload request.");
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    // ✅ Generate a unique cache key based on file hash
    const fileHash = Buffer.from(req.file.originalname).toString("base64");
    const cacheKey = `resumeText:${fileHash}`;

    // ✅ Check Redis cache first
    const cachedResumeText = await getCachedResponse(cacheKey);
    if (cachedResumeText) {
      logger.info("✅ Returning extracted resume text from cache");
      res.status(200).json({ resumeText: cachedResumeText });
      return;
    }

    // ✅ Validate file path before parsing
    if (!req.file.path) {
      logger.error("❌ Uploaded file does not have a valid path.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    // Process PDF if not in cache
    const structuredResume = await parseResumeFromPDF(req.file.path);

    if (!structuredResume) {
      logger.error("❌ Failed to extract resume content from PDF.");
      res.status(500).json({ error: "Failed to extract resume content." });
      return;
    }

    // ✅ Store extracted resume text in Redis for 24 hours
    await setCachedResponse(cacheKey, structuredResume, 86400);

    logger.info("✅ Successfully processed and cached resume text.");
    res.status(200).json(structuredResume);
  } catch (error) {
    logger.error(`❌ Error processing uploaded resume: ${error instanceof Error ? error.message : "Unknown error"}`);
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
      logger.warn("⚠️ Missing file path in resume processing request.");
      res.status(400).json({ error: "Missing file path." });
      return;
    }

    // ✅ Ensure file exists before parsing
    if (!filePath || typeof filePath !== "string") {
      logger.error("❌ Invalid file path provided.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    // ✅ Parses resume from PDF
    const structuredResume = await parseResumeFromPDF(filePath);

    if (!structuredResume) {
      logger.error("❌ Resume processing failed. No structured data extracted.");
      res.status(500).json({ error: "Failed to process resume data." });
      return;
    }

    logger.info("✅ Successfully processed structured resume.");
    res.status(200).json(structuredResume);
  } catch (error) {
    logger.error(`❌ Error processing resume data: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Error processing resume data." });
  }
};
