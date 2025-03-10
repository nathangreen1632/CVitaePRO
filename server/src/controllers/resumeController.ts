import { RequestHandler, Request, Response } from "express";
import pool from "../db/pgClient.js"; // ✅ Import PostgreSQL client
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import { getCachedResponse, setCachedResponse, deleteCachedResponse } from "../services/cacheService.js"; // ✅ Import Redis delete function
// import logger from "../register/logger.js"; // ✅ Use structured logging
import { generateFromOpenAI } from "../services/openaiService.js"; // ✅ Import OpenAI processing
import { validate as uuidValidate } from "uuid";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js"; // ✅ Import your AuthenticatedRequest type


declare module "express" {
  interface Request {
    user?: { id: string }; // Augmenting Express's Request type to include 'user'
  }
}

export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      console.warn("⚠️ No file uploaded in resume upload request.");
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    // ✅ Generate a unique cache key based on file hash
    const fileHash = Buffer.from(req.file.originalname).toString("base64");
    const cacheKey = `resumeText:${fileHash}`;

    // ✅ Check Redis cache first
    const cachedResumeText = await getCachedResponse(cacheKey);
    if (cachedResumeText) {
      console.log("✅ Returning extracted resume text from cache");
      res.status(200).json({ resumeText: cachedResumeText });
      return;
    }

    // ✅ Validate file path before parsing
    if (!req.file.path) {
      console.error("❌ Uploaded file does not have a valid path.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    // Process PDF if not in cache
    const structuredResume = await parseResumeFromPDF(req.file.path);

    if (!structuredResume) {
      console.error("❌ Failed to extract resume content from PDF.");
      res.status(500).json({ error: "Failed to extract resume content." });
      return;
    }

    // ✅ Store extracted resume text in Redis for 24 hours
    await setCachedResponse(cacheKey, structuredResume, 86400);

    console.log("✅ Successfully processed and cached resume text.");
    res.status(200).json(structuredResume);
  } catch (error) {
    console.error(`❌ Error processing uploaded resume: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Error processing resume file." });
  }
};

/**
 * Handles enhancing an existing resume using OpenAI.
 */
export const enhanceResume: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, resumeText } = req.body;
    console.log("🚀 Received request body:", req.body);

    if (!userId || !resumeText) {
      res.status(400).json({ success: false, message: "Missing userId or resumeText" });
      return;
    }

    console.log(`🟡 Enhancing resume for user: ${userId}`);

    // ✅ Fix: Change "enhanceResume" to "resume" (TS2345 Fix)
    const enhancedResume = await generateFromOpenAI(userId, "resume", resumeText);

    if (!enhancedResume.success) {
      res.status(500).json({ success: false, message: enhancedResume.message });
      return;
    }

    // ✅ Fix: Ensure raw resume is removed from Redis
    const rawCacheKey = `resumeText:${userId}`;
    await deleteCachedResponse(rawCacheKey);
    console.log(`🗑️ Deleted raw resume from Redis cache: ${rawCacheKey}`);

    res.status(200).json({ success: true, message: "Resume enhanced successfully", enhancedResume });
  } catch (error) {
    console.error("❌ Error enhancing resume:", error);
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
      console.warn("⚠️ Missing file path in resume processing request.");
      res.status(400).json({ error: "Missing file path." });
      return;
    }

    // ✅ Ensure file exists before parsing
    if (!filePath || typeof filePath !== "string") {
      console.error("❌ Invalid file path provided.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    // ✅ Parses resume from PDF
    const structuredResume = await parseResumeFromPDF(filePath);

    if (!structuredResume) {
      console.error("❌ Resume processing failed. No structured data extracted.");
      res.status(500).json({ error: "Failed to process resume data." });
      return;
    }

    console.log("✅ Successfully processed structured resume.");
    res.status(200).json(structuredResume);
  } catch (error) {
    console.error(`❌ Error processing resume data: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Error processing resume data." });
  }
};


export const listResumes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ success: false, message: "Invalid user ID provided." });
      return;
    }

    const queryResult = await pool.query(
      `SELECT id, user_id, title, content, extracted_text, file_hash,
              experience, education, skills, certifications, created_at, updated_at
       FROM public."Resumes"
       WHERE user_id = $1`,
      [userId]
    );

    if (queryResult.rowCount === 0) {
      console.log(`❌ No resumes found for user: ${userId}`);
      res.status(404).json({ success: false, message: "No resumes found for this user." });
      return;
    }

// ✅ Format the response to match frontend expectations
    const formattedResumes = queryResult.rows.map(row => ({
      id: row.id,
      name: row.title || "Untitled Resume",
      resumeSnippet: row.content,
      summary: row.extracted_text || "No summary available",
      experience: row.experience || [],
      education: row.education || [],
      skills: row.skills || [],
      certifications: row.certifications || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    console.log(`✅ ${queryResult.rowCount} resumes found and returned for user: ${userId}`);

    res.status(200).json({ success: true, resumes: formattedResumes });

  } catch (error) {
    console.error(`❌ Error fetching resumes:`, error);
    res.status(500).json({ success: false, message: "Internal server error while retrieving resumes." });
  }
};


export const getResumeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!id || id === "list" || !uuidValidate(id)) {
      console.log(`❌ Invalid resume ID received: ${id}`);
      res.status(400).json({ success: false, message: "Invalid resume ID provided." });
      return;
    }

    console.log(`🔍 Fetching resume with ID: ${id} for user: ${userId}`);

    const queryResult = await pool.query(
      `SELECT * FROM public."Resumes" WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (queryResult.rowCount === 0) {
      console.log(`❌ Resume not found for user: ${userId}`);
      res.status(404).json({ success: false, message: "Resume not found or unauthorized." });
      return;
    }

    console.log(`✅ Resume found and returned for user: ${userId}`);

    res.status(200).json({ success: true, resume: queryResult.rows[0] });
  } catch (error) {
    console.error(`❌ Error fetching resume: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ success: false, message: "Internal server error while retrieving the resume." });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  const { resumeId } = req.params;
  const userId = req.user?.id;

  console.log(`🗑️ Request to delete resume: ${resumeId} by user: ${userId}`);

  if (!resumeId) {
    res.status(400).json({ success: false, message: "Missing resume ID" });
    return;
  }

  try {
    // ✅ Check if the resume exists AND belongs to the user
    const resumeCheck = await pool.query(
      `SELECT id FROM "Resumes" WHERE id = $1 AND user_id = $2`,
      [resumeId, userId]
    );

    if (resumeCheck.rowCount === 0) {
      res.status(404).json({ success: false, message: "Resume not found or unauthorized" });
      return;
    }

    // ✅ Delete the resume
    await pool.query(`DELETE FROM "Resumes" WHERE id = $1`, [resumeId]);

    console.log(`✅ Resume ${resumeId} deleted successfully`);
    res.json({ success: true, message: "Resume deleted successfully" });
    return;

  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ success: false, message: "Server error while deleting resume" });
    return;
  }
};