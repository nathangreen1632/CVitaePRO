import { RequestHandler, Request, Response } from "express";
import pool from "../db/pgClient.js"; // ✅ Import PostgreSQL client
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import { getCachedResponse, setCachedResponse, deleteCachedResponse } from "../services/cacheService.js";
import { generateFromOpenAI } from "../services/openaiService.js"; // ✅ Import OpenAI processing
import { validate as uuidValidate } from "uuid";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import PDFDocument from "pdfkit"; // ✅ For resume PDF generation
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js";
import {saveToPostgreSQL} from "../services/postgreSQLService.js"; // ✅ Adjust path if needed



declare module "express" {
  interface Request {
    user?: { id: string };
  }
}

export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      console.warn("⚠️ No file uploaded in resume upload request.");
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const fileHash = Buffer.from(req.file.originalname).toString("base64");
    const cacheKey = `resumeText:${fileHash}`;
    const cachedResumeText = await getCachedResponse(cacheKey);

    if (cachedResumeText) {
      console.log("✅ Returning extracted resume text from cache");
      res.status(200).json({ resumeText: cachedResumeText });
      return;
    }

    if (!req.file.path) {
      console.error("❌ Uploaded file does not have a valid path.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(req.file.path);

    if (!structuredResume) {
      console.error("❌ Failed to extract resume content from PDF.");
      res.status(500).json({ error: "Failed to extract resume content." });
      return;
    }

    await setCachedResponse(cacheKey, structuredResume, 86400);
    console.log("✅ Successfully processed and cached resume text.");
    res.status(200).json(structuredResume);
  } catch (error) {
    console.error(`❌ Error processing uploaded resume: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({ error: "Error processing resume file." });
  }
};

export const enhanceResume: RequestHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { resumeText } = req.body;
    console.log("🚀 Received enhanceResume request:", { userId, resumeText });

    if (!resumeText) {
      res.status(400).json({ success: false, message: "Missing resume text" });
      return;
    }

    // ✅ Generate new resume via OpenAI
    const enhancedResponse = await generateFromOpenAI(userId, "resume", resumeText);

    if (!enhancedResponse.success || !enhancedResponse.message) {
      res.status(500).json({ success: false, message: enhancedResponse.message || "OpenAI enhancement failed" });
      return;
    }

    // ✅ Parse AI response into structured JSON
    const structuredResume = parseResumeMarkdown(enhancedResponse.message, {});

    console.log("🧠 Parsed Enhanced Resume:", structuredResume);

    // ✅ Save structured resume to PostgreSQL
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(enhancedResponse.message).digest("hex");

    const saveResult = await saveToPostgreSQL(
      hash,
      enhancedResponse.message,
      userId,
      structuredResume
    );

    if (!saveResult.success) {
      res.status(500).json({ success: false, message: saveResult.message });
      return;
    }

    // ✅ Cache resume in Redis
    const cacheKey = `resume:${hash}`;
    await setCachedResponse(cacheKey, structuredResume, 86400);

    res.status(200).json({
      success: true,
      message: "Resume enhanced and saved successfully",
      resume: structuredResume,
    });
  } catch (error) {
    console.error("❌ Error enhancing and saving resume:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const processResume: RequestHandler = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      console.warn("⚠️ Missing file path in resume processing request.");
      res.status(400).json({ error: "Missing file path." });
      return;
    }

    if (!filePath || typeof filePath !== "string") {
      console.error("❌ Invalid file path provided.");
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

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
              email, phone, linkedin, portfolio,        -- ✅ Make sure these fields are included
              experience, education, skills, certifications, created_at, updated_at
       FROM public."Resumes"
       WHERE user_id = $1`,
      [userId]
    );


    const formattedResumes = queryResult.rows.map(row => ({
      id: row.id,
      name: row.title || "Untitled Resume",
      jobTitle: "N/A",
      resumeSnippet: row.content || "",
      summary: row.extracted_text || "",
      email: row.email || "",              // ✅ REQUIRED
      phone: row.phone || "",              // ✅ REQUIRED
      linkedin: row.linkedin || "",        // ✅ REQUIRED
      portfolio: row.portfolio || "",      // ✅ REQUIRED
      experience: row.experience || [],
      education: row.education || [],
      skills: row.skills || [],
      certifications: row.certifications || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    console.log(`✅ ${queryResult.rowCount} resumes found and returned for user: ${userId}`);
    res.status(200).json({ success: true, resumes: formattedResumes }); // ✅ Always 200, even if empty

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
    const resumeCheck = await pool.query(
      `SELECT id FROM "Resumes" WHERE id = $1 AND user_id = $2`,
      [resumeId, userId]
    );

    if (resumeCheck.rowCount === 0) {
      res.status(404).json({ success: false, message: "Resume not found or unauthorized" });
      return;
    }

    // ✅ Delete from PostgreSQL
    await pool.query(`DELETE FROM "Resumes" WHERE id = $1`, [resumeId]);

    // ✅ Invalidate Redis cache using centralized service
    const redisKey = `resume:${resumeId}`;
    await deleteCachedResponse(redisKey);
    console.log(`🧹 Redis cache cleared for key: ${redisKey}`);

    console.log(`✅ Resume ${resumeId} deleted successfully`);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ success: false, message: "Server error while deleting resume" });
  }
};

// ✅ New - Download Resume as PDF
export const downloadResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: resumeId } = req.params;
    const userId = req.user?.id;

    if (!resumeId || !uuidValidate(resumeId)) {
      res.status(400).json({ error: "Invalid resume ID." });
      return;
    }

    const result = await pool.query(
      `SELECT id, title, content, extracted_text, experience, education, skills, certifications,
              email, phone, linkedin, portfolio
       FROM "Resumes"
       WHERE id = $1 AND user_id = $2`,
      [resumeId, userId]
    );


    if (result.rowCount === 0) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }

    const resume = result.rows[0];

    // ✅ Strip markdown and get structured data
    const parsed = parseResumeMarkdown(resume.content, {
      name: resume.title,
      email: resume.email || "",               // ✅ Pass fallback
      phone: resume.phone || "",               // ✅ Pass fallback
      linkedin: resume.linkedin || "",         // ✅ Optional: future-proof
      portfolio: resume.portfolio || "",       // ✅ Optional: future-proof
      summary: resume.extracted_text,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      certifications: resume.certifications,
    });

    const formatWorkDates = (start: string, end?: string): string => {
      if (!start || start.trim() === "") {
        return ""; // Don't throw here — handle silently server-side
      }

      const trimmedStart = start.trim();
      const trimmedEnd = end?.trim() ?? "";

      if (trimmedStart && trimmedEnd) {
        return `${trimmedStart} to ${trimmedEnd}`;
      } else if (trimmedStart && !trimmedEnd) {
        return `${trimmedStart} to Present`;
      } else {
        return "";
      }
    };



    // ✅ Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${resume.title || "resume"}.pdf"`);

    doc.pipe(res);
    doc.fontSize(20).text(parsed.name || "Untitled Resume", { underline: true });
    doc.moveDown();

    if (parsed.email) doc.fontSize(12).text(`Email: ${parsed.email}`);
    if (parsed.phone) doc.text(`Phone: ${parsed.phone}`);
    if (parsed.linkedin) doc.text(`LinkedIn: ${parsed.linkedin}`);
    if (parsed.portfolio) doc.text(`Portfolio: ${parsed.portfolio}`);
    doc.moveDown();

    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(parsed.summary);
    doc.moveDown();

    doc.fontSize(14).text("Experience", { underline: true });
    parsed.experience.forEach((job: any) => {
      doc.fontSize(12).text(`${job.company} — ${job.role}`);
      doc.text(formatWorkDates(job.start_date, job.end_date));
      job.responsibilities.forEach((r: string) => {
        doc.text(`• ${r}`);
      });
      doc.moveDown();
    });

    doc.fontSize(14).text("Education", { underline: true });
    parsed.education.forEach((edu: any) => {
      doc.fontSize(12).text(`${edu.degree} at ${edu.institution} (${edu.graduation_year})`);
    });
    doc.moveDown();

    doc.fontSize(14).text("Skills", { underline: true });
    parsed.skills.forEach((line: string) => {
      const [label, content] = line.split(":").map(str => str.trim());
      if (label && content) {
        doc.fontSize(12).text(`${label}: ${content}`);
      } else {
        doc.fontSize(12).text(line);
      }
    });
    doc.moveDown();


    doc.fontSize(14).text("Certifications", { underline: true });
    parsed.certifications.forEach((cert: any) => {
      const hasYear = cert.year && cert.year.trim().length > 0;
      const line = hasYear ? `${cert.name} (${cert.year})` : `${cert.name}`;
      doc.fontSize(12).text(line);
    });


    doc.end();
  } catch (error) {
    console.error("❌ Error downloading resume:", error);
    res.status(500).json({ error: "Failed to download resume." });
  }
};

