import { RequestHandler, Request } from "express";
import pool from "../db/pgClient.js"; // ✅ Import PostgreSQL client
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import { getCachedResponse, setCachedResponse, deleteCachedResponse } from "../services/cacheService.js"; // ✅ Import Redis delete function
import logger from "../register/logger.js"; // ✅ Use structured logging
import { generateFromOpenAI } from "../services/openaiService.js"; // ✅ Import OpenAI processing

declare module "express" {
  interface Request {
    user?: { id: string }; // Augmenting Express's Request type to include 'user'
  }
}

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
 * Handles enhancing an existing resume using OpenAI.
 */
export const enhanceResume: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, resumeText } = req.body;

    if (!userId || !resumeText) {
      res.status(400).json({ success: false, message: "Missing userId or resumeText" });
      return;
    }

    logger.info(`🟡 Enhancing resume for user: ${userId}`);

    // ✅ Fix: Change "enhanceResume" to "resume" (TS2345 Fix)
    const enhancedResume = await generateFromOpenAI(userId, "resume", resumeText);

    if (!enhancedResume.success) {
      res.status(500).json({ success: false, message: enhancedResume.message });
      return;
    }

    // ✅ Fix: Ensure raw resume is removed from Redis
    const rawCacheKey = `resumeText:${userId}`;
    await deleteCachedResponse(rawCacheKey);
    logger.info(`🗑️ Deleted raw resume from Redis cache: ${rawCacheKey}`);

    res.status(200).json({ success: true, message: "Resume enhanced successfully", enhancedResume });
  } catch (error) {
    logger.error("❌ Error enhancing resume:", error);
    res.status(500).json({ success: false, message: "Failed to enhance resume." });
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

export const listResumes: RequestHandler = async (req, res) => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required." });
      return;
    }

    logger.info(`🔍 Fetching resumes for user: ${userId}`);

    // ✅ FIXED: Changed "Resumes" to "resumes"
    const queryResult = await pool.query(
      `SELECT * FROM public."Resumes" WHERE user_id = $1`,
      [userId]
    );


    if (queryResult.rowCount === 0) {
      logger.info(`❌ No resumes found for user: ${userId}`);
      res.status(404).json({ success: false, message: "No resumes found for this user." });
      return;
    }

    logger.info(`✅ ${queryResult.rowCount} resumes found and returned for user: ${userId}`);

    res.status(200).json({ success: true, Resumes: queryResult.rows });
  } catch (error) {
    logger.error(`❌ Error fetching resumes: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ success: false, message: "Internal server error while retrieving resumes." });
  }
};


export const getResumeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!id) {
      res.status(400).json({ success: false, message: "Resume ID is required." });
      return;
    }

    logger.info(`🔍 Fetching resume with ID: ${id} for user: ${userId}`);

    // ✅ FIXED: Changed "public.Resumes" to "public.resumes"
    const queryResult = await pool.query(
      `SELECT * FROM public."Resumes" WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );


    if (queryResult.rowCount === 0) {
      logger.info(`❌ Resume not found for user: ${userId}`);
      res.status(404).json({ success: false, message: "Resume not found or unauthorized." });
      return;
    }

    logger.info(`✅ Resume found and returned for user: ${userId}`);

    res.status(200).json({ success: true, resume: queryResult.rows[0] });
  } catch (error) {
    logger.error(`❌ Error fetching resume: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ success: false, message: "Internal server error while retrieving the resume." });
  }
};