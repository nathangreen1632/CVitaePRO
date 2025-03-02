import { extractTextFromPDF } from "../utils/pdfReader.js";
import { normalizeResume } from "./resumeNormalizer.js";
import { ResumeData } from "../types/resumeTypes.js";
import { getCachedResponse, setCachedResponse } from "./cacheService.js"; // ✅ Import Redis

export async function parseResumeFromPDF(filePath: string): Promise<ResumeData> {
  // ✅ Generate a unique cache key based on file path
  const cacheKey = `normalizedResume:${filePath}`;

  // ✅ Check Redis cache first
  const cachedResume = await getCachedResponse(cacheKey);
  if (cachedResume) {
    console.log("✅ Returning normalized resume from cache");
    return cachedResume;
  }

  // Extract and normalize resume text
  const rawText = await extractTextFromPDF(filePath);
  const structuredResume = normalizeResume(rawText);

  // ✅ Store structured resume in Redis for 24 hours
  await setCachedResponse(cacheKey, structuredResume, 86400);

  return structuredResume;
}
