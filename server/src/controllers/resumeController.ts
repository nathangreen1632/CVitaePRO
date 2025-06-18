import { RequestHandler, Request, Response } from "express";
import pool from "../db/pgClient.js";
import { parseResumeFromPDF } from "../services/pdfResumeParser.js";
import {
  getCachedResponse,
  setCachedResponse,
  deleteCachedResponse,
} from "../services/cacheService.js";
import { generateFromOpenAI } from "../services/openaiService.js";
import { validate as uuidValidate } from "uuid";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import PDFDocument from "pdfkit";
import { parseResumeMarkdown } from "../utils/parseResumeMarkdown.js";
import { saveToPostgreSQL } from "../services/postgreSQLService.js";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

declare module "express" {
  interface Request {
    user?: { id: string };
  }
}

/* ─────────────────────────────────────────────────────────────
   UPLOAD RESUME
──────────────────────────────────────────────────────────── */
export const uploadResume: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const fileHash = Buffer.from(req.file.originalname).toString("base64");
    const cacheKey = `resumeText:${fileHash}`;
    const cachedResumeText = await getCachedResponse(cacheKey);

    if (cachedResumeText) {
      res.status(200).json({ resumeText: cachedResumeText });
      return;
    }

    if (!req.file.path) {
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(req.file.path);

    if (!structuredResume) {
      res.status(500).json({ error: "Failed to extract resume content." });
      return;
    }

    await setCachedResponse(cacheKey, structuredResume, 86400);
    res.status(200).json(structuredResume);
  } catch (error) {
    console.error("Error processing resume file:", error);
    res.status(500).json({ error: "Error processing resume file." });
  }
};

/* ─────────────────────────────────────────────────────────────
   ENHANCE RESUME (OpenAI)
──────────────────────────────────────────────────────────── */
export const enhanceResume: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400).json({ success: false, message: "Missing resume text" });
      return;
    }

    const enhancedResponse = await generateFromOpenAI(
      userId,
      "resume",
      resumeText
    );

    if (!enhancedResponse.success || !enhancedResponse.message) {
      res.status(500).json({
        success: false,
        message: enhancedResponse.message || "OpenAI enhancement failed",
      });
      return;
    }

    const structuredResume = parseResumeMarkdown(enhancedResponse.message, {});
    const crypto = await import("crypto");
    const hash = crypto
      .createHash("sha256")
      .update(enhancedResponse.message)
      .digest("hex");

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

    const cacheKey = `resume:${hash}`;
    await setCachedResponse(cacheKey, structuredResume, 86400);

    res.status(200).json({
      success: true,
      message: "Resume enhanced and saved successfully",
      resume: structuredResume,
    });
  } catch (error) {
    console.error("Error enhancing resume:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PROCESS RESUME (PDF path)
──────────────────────────────────────────────────────────── */
export const processResume: RequestHandler = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath || typeof filePath !== "string") {
      res.status(400).json({ error: "Invalid file path." });
      return;
    }

    const structuredResume = await parseResumeFromPDF(filePath);

    if (!structuredResume) {
      res.status(500).json({ error: "Failed to process resume data." });
      return;
    }

    res.status(200).json(structuredResume);
  } catch (error) {
    console.error("Error processing resume data:", error);
    res.status(500).json({ error: "Error processing resume data." });
  }
};

/* ─────────────────────────────────────────────────────────────
   LIST RESUMES
──────────────────────────────────────────────────────────── */
export const listResumes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(400)
        .json({ success: false, message: "Invalid user ID provided." });
      return;
    }

    const queryResult = await pool.query(
      `SELECT id, user_id, title, content, extracted_text, file_hash,
              email, phone, linkedin, portfolio,
              experience, education, skills, certifications, created_at, updated_at
       FROM public."Resumes"
       WHERE user_id = $1`,
      [userId]
    );

    const formattedResumes = queryResult.rows.map((row) => ({
      id: row.id,
      name: row.title ?? "Untitled Resume",
      jobTitle: "N/A",
      resumeSnippet: row.content ?? "",
      summary: row.extracted_text ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      linkedin: row.linkedin ?? "",
      portfolio: row.portfolio ?? "",
      experience: row.experience ?? [],
      education: row.education ?? [],
      skills: row.skills ?? [],
      certifications: row.certifications ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.status(200).json({ success: true, resumes: formattedResumes });
  } catch (error) {
    console.error("Error retrieving resumes:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while retrieving resumes.",
      });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET RESUME BY ID
──────────────────────────────────────────────────────────── */
export const getResumeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!id || id === "list" || !uuidValidate(id)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid resume ID provided." });
      return;
    }

    const queryResult = await pool.query(
      `SELECT * FROM public."Resumes" WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (queryResult.rowCount === 0) {
      res
        .status(404)
        .json({ success: false, message: "Resume not found or unauthorized." });
      return;
    }

    res.status(200).json({ success: true, resume: queryResult.rows[0] });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while retrieving the resume.",
      });
  }
};

/* ─────────────────────────────────────────────────────────────
   DELETE RESUME
──────────────────────────────────────────────────────────── */
export const deleteResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { resumeId } = req.params;
  const userId = req.user?.id;

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
      res
        .status(404)
        .json({ success: false, message: "Resume not found or unauthorized" });
      return;
    }

    await pool.query(`DELETE FROM "Resumes" WHERE id = $1`, [resumeId]);

    const redisKey = `resume:${resumeId}`;
    await deleteCachedResponse(redisKey);

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting resume" });
  }
};

/* ─────────────────────────────────────────────────────────────
   DOWNLOAD RESUME (PDF / DOCX)
──────────────────────────────────────────────────────────── */
export const downloadResume: RequestHandler = async (req, res) => {
  try {
    const { id: resumeId } = req.params;
    const { format = "pdf" } = req.query;
    const userId = (req as AuthenticatedRequest).user?.id;

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

    const parsed = parseResumeMarkdown(resume.content, {
      name: resume.title,
      email: resume.email ?? "",
      phone: resume.phone ?? "",
      linkedin: resume.linkedin ?? "",
      portfolio: resume.portfolio ?? "",
      summary: resume.extracted_text,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      certifications: resume.certifications,
    });

    const formatWorkDates = (start: string, end?: string): string => {
      if (!start || start.trim() === "") return "";
      const trimmedStart = start.trim();
      const trimmedEnd = end?.trim() ?? "";
      if (trimmedStart && trimmedEnd) return `${trimmedStart} to ${trimmedEnd}`;
      if (trimmedStart && !trimmedEnd) return trimmedStart;
      return "";
    };

    /* --------------------------------------------------------
       DOCX DOWNLOAD
    -------------------------------------------------------- */
    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1000,
                  right: 1440,
                  bottom: 1000,
                  left: 1440,
                },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 175 },
                children: [
                  new TextRun({
                    text: parsed.name,
                    bold: true,
                    font: "Times New Roman",
                    size: 36,
                  }),
                ],
              }),

              ...[
                parsed.email &&
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: "Email: ", bold: true, size: 24 }),
                    new TextRun({ text: parsed.email, size: 24 }),
                  ],
                }),
                parsed.phone &&
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: "Phone: ", bold: true, size: 24 }),
                    new TextRun({ text: parsed.phone, size: 24 }),
                  ],
                }),
                parsed.linkedin &&
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: "LinkedIn: ", bold: true, size: 24 }),
                    new TextRun({ text: parsed.linkedin, size: 24 }),
                  ],
                }),
                parsed.portfolio &&
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({ text: "Portfolio: ", bold: true, size: 24 }),
                    new TextRun({ text: parsed.portfolio, size: 24 }),
                  ],
                }),
              ].filter(Boolean),

              new Paragraph({
                text: "Summary",
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 100 },
              }),
              new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: parsed.summary, size: 24 })],
              }),

              new Paragraph({
                text: "Experience",
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 200 },
              }),
              ...parsed.experience.flatMap((job: any) => {
                const companyAndRole = `${job.company} — ${job.role}`;
                const dates = formatWorkDates(job.start_date, job.end_date);

                const experienceHeader = new Paragraph({
                  spacing: { after: 100 },
                  tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
                  children: [
                    new TextRun({ text: companyAndRole, bold: true, size: 24 }),
                    new TextRun({ text: "\t" }),
                    new TextRun({ text: dates, bold: true, size: 24 }),
                  ],
                });


                const bulletPoints = job.responsibilities.map(
                  (r: string) =>
                    new Paragraph({
                      spacing: { after: 100 },
                      bullet: { level: 0 },
                      children: [new TextRun({ text: r, size: 24 })],
                    })
                );

                return [experienceHeader, ...bulletPoints];
              }),

              ...(() => {
                const realEdu = parsed.education.filter(
                  (e: any) =>
                    e.degree?.trim() &&
                    e.institution?.trim() &&
                    e.graduation_year?.trim()
                );
                if (realEdu.length === 0) return [];
                return [
                  new Paragraph({
                    text: "Education",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                  }),
                  ...realEdu.map(
                    (edu: any) =>
                      new Paragraph({
                        spacing: { after: 100 },
                        indent: { left: 400 },
                        children: [
                          new TextRun({
                            text: `${edu.degree} at ${edu.institution} (${edu.graduation_year})`,
                            size: 24,
                          }),
                        ],
                      })
                  ),
                ];
              })(),

              ...(() => {
                const skills = parsed.skills
                  .map((s: string) => s.trim())
                  .filter(Boolean);

                if (skills.length < 2) return [];

                const blocks: Paragraph[] = [
                  new Paragraph({
                    text: "Skills",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                  }),
                ];

                for (let i = 0; i < skills.length; i += 2) {
                  const rawLabel = skills[i] ?? "";
                  const rawContent = skills[i + 1] ?? "";

                  const label = rawLabel
                    .normalize("NFKD")
                    .replace(/\p{C}+/gu, "")
                    .replace(/[ :]{1,10}$/, "");

                  const content = rawContent
                    .normalize("NFKD")
                    .replace(/\p{C}+/gu, "")
                    .trim();

                  if (label && content) {
                    blocks.push(
                      new Paragraph({
                        spacing: { after: 50 },
                        children: [
                          new TextRun({
                            text: `${label}:`,
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 150 },
                        indent: { left: 400 },
                        children: [new TextRun({ text: content, size: 24 })],
                      })
                    );
                  }
                }
                return blocks;
              })(),

              ...(() => {
                const certs = parsed.certifications.filter((c: any) => {
                  const name = (c.name ?? "").trim().toLowerCase();
                  return (
                    name &&
                    name !== "certifications" &&
                    !name.includes("placeholder")
                  );
                });
                if (certs.length === 0) return [];
                return [
                  new Paragraph({
                    text: "Certifications",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                  }),
                  ...certs
                    .map((cert: any) => {
                      const n = cert.name?.trim();
                      const y = cert.year?.trim();
                      if (!n) return null;
                      return new Paragraph({
                        spacing: { after: 100 },
                        indent: { left: 400 },
                        children: [
                          new TextRun({
                            text: y ? `${n} (${y})` : n,
                            size: 24,
                          }),
                        ],
                      });
                    })
                    .filter(Boolean),
                ];
              })(),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${parsed.name}-resume.docx"`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.send(buffer);
      return;
    }

    /* --------------------------------------------------------
       PDF DOWNLOAD
    -------------------------------------------------------- */
    const pdf = new PDFDocument({ margin: 65 });
    const filename = `${parsed.name ?? "Resume"}-resume.pdf`;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Type", "application/pdf");
    pdf.pipe(res);

    pdf.font("Times-Roman").fontSize(20).text(parsed.name ?? "Untitled Resume", {
      align: "center",
      underline: true,
    });

    pdf.moveDown(0.5).fontSize(12);

    if (parsed.email) {
      pdf.font("Times-Bold").text("Email:", { continued: true });
      pdf.font("Times-Roman").text(` ${parsed.email}`);
    }
    if (parsed.phone) {
      pdf.font("Times-Bold").text("Phone:", { continued: true });
      pdf.font("Times-Roman").text(` ${parsed.phone}`);
    }
    if (parsed.linkedin) {
      pdf.font("Times-Bold").text("LinkedIn:", { continued: true });
      pdf.font("Times-Roman").text(` ${parsed.linkedin}`);
    }
    if (parsed.portfolio) {
      pdf.font("Times-Bold").text("Portfolio:", { continued: true });
      pdf.font("Times-Roman").text(` ${parsed.portfolio}`);
    }

    pdf.moveDown().fontSize(14).text("Summary", { underline: true });
    pdf.moveDown(0.5).fontSize(12).text(parsed.summary, { lineGap: 1 });

    pdf.moveDown().fontSize(14).text("Experience", { underline: true });
    pdf.moveDown(0.5);
    parsed.experience.forEach((job: any) => {
      const left = `${job.company} — ${job.role}`;
      const right = formatWorkDates(job.start_date, job.end_date);

      const pageW =
        pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
      pdf.font("Times-Bold").fontSize(12);
      const lW = pdf.widthOfString(left);
      const rW = pdf.widthOfString(right);
      const gap = pageW - lW - rW;

      pdf
        .font("Times-Bold")
        .text(left, { continued: true })
        .text(" ".repeat(Math.max(gap / 3, 2)), { continued: true })
        .text(right);
      pdf.moveDown(0.5);

      pdf.font("Times-Roman").fontSize(12);
      job.responsibilities.forEach((r: string) => {
        pdf.text(`• ${r}`, { lineGap: 2 });
      });
      pdf.moveDown();
    });

    pdf.fontSize(14).text("Education", { underline: true });
    pdf.moveDown(0.5);
    parsed.education.forEach((edu: any) => {
      pdf
        .fontSize(12)
        .text(`${edu.degree} at ${edu.institution} (${edu.graduation_year})`, {
          indent: 10,
        });
    });

    pdf.moveDown().fontSize(14).text("Skills", { underline: true });
    pdf.moveDown(0.5);

    for (let i = 0; i < parsed.skills.length; i += 2) {
      const rawLabel = parsed.skills[i] ?? "";
      const rawContent = parsed.skills[i + 1] ?? "";

      const label = rawLabel
        .normalize("NFKD")
        .replace(/\p{C}+/gu, "")
        .replace(/[ :]{1,10}$/, "");

      const content = rawContent
        .normalize("NFKD")
        .replace(/\p{C}+/gu, "")
        .trim();

      if (!label || !content) continue;

      pdf.font("Times-Bold").fontSize(12).text(`${label}:`, {
        indent: 10,
      });
      pdf.moveDown(0.3);
      pdf.font("Times-Roman").fontSize(12).text(content, {
        indent: 20,
        lineGap: 1,
      });
      pdf.moveDown(0.25);
    }

    const certs = parsed.certifications.filter((c: any) => {
      const n = (c.name ?? "").trim().toLowerCase();
      return n && n !== "certifications" && !n.includes("placeholder");
    });

    if (certs.length > 0) {
      pdf.moveDown().fontSize(14).text("Certifications", { underline: true });
      pdf.moveDown(0.5);
      certs.forEach((cert: any) => {
        const name = cert.name?.trim();
        if (!name) return;
        const year = cert.year?.trim();
        pdf
          .fontSize(12)
          .text(year ? `${name} (${year})` : name, { indent: 10 });
      });
    }

    pdf.end();
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).json({ error: "Failed to download resume." });
  }
};

/* ─────────────────────────────────────────────────────────────
   DOWNLOAD EDITOR DOCX
──────────────────────────────────────────────────────────── */
export const downloadEditorDocx: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { resume, name } = req.body;

    if (!resume || typeof resume !== "string") {
      res.status(400).json({ error: "Missing or invalid resume text." });
      return;
    }

    const lines = resume.split("\n").map((line) => line.trim());

    const doc = new Document({
      sections: [
        {
          children: lines.map(
            (line) =>
              new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: line, font: "Arial", size: 24 })],
              })
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name ?? "Enhanced_Resume"}.docx"`
    );
    res.send(buffer);
  } catch (err) {
    console.error("Error generating DOCX:", err);
    res.status(500).json({ error: "Failed to generate DOCX from editor text." });
  }
};

/* ─────────────────────────────────────────────────────────────
   DOWNLOAD EDITOR PDF
──────────────────────────────────────────────────────────── */
export const downloadEditorPdf: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { resume, name } = req.body;

    if (!resume || typeof resume !== "string") {
      res.status(400).json({ error: "Missing or invalid resume text." });
      return;
    }

    const doc = new PDFDocument();
    const filename = `${name ?? "Enhanced_Resume"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);
    doc.font("Helvetica").fontSize(12).text(resume, {
      align: "left",
      lineGap: 4,
    });
    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF from editor text." });
  }
};
