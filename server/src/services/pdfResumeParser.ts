import { extractTextFromPDF } from "../utils/pdfReader.js";
import { normalizeResume } from "./resumeNormalizer.js";
import { ResumeData } from "../types/resumeTypes.js";

/**
 * Parses a PDF and converts it into a structured resume object.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<ResumeData>} - Parsed resume data.
 */
export async function parseResumeFromPDF(filePath: string): Promise<ResumeData> {
  const rawText = await extractTextFromPDF(filePath);
  return normalizeResume(rawText);
}
