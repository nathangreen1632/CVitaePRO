import { extractTextFromPDF } from "../utils/pdfReader.js";
import { normalizeResume } from "./resumeNormalizer.js";
import { ResumeData } from "../types/resumeTypes.js";
import { getCachedResponse, setCachedResponse } from "./cacheService.js";

export async function parseResumeFromPDF(filePath: string): Promise<ResumeData> {
  const cacheKey = `normalizedResume:${filePath}`;

  const cachedResume = await getCachedResponse(cacheKey);
  if (cachedResume) {
    return cachedResume;
  }

  const rawText = await extractTextFromPDF(filePath);
  const structuredResume = normalizeResume(rawText);

  await setCachedResponse(cacheKey, structuredResume, 1800);

  return structuredResume;
}
