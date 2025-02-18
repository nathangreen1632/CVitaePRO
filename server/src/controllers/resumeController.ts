import { Request, Response } from "express";

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: string;
  }
}
import pdfParse from "pdf-parse";
import redis from "../cache/redisCache.js";
import { generateResume } from "../services/openAIService.js";
import fileUpload from "express-fileupload";

// Extend Express Request to include 'files'
interface FileUploadRequest extends Request {
  files: fileUpload.FileArray | undefined;
}

export const generateResumeHandler = async (req: Request, res: Response): Promise<void> => {
  const { jobTitle, experience, skills } = req.body;
  const userId: string = req.user!;

  if (!jobTitle || !experience || !skills) {
    res.status(400).json({ message: "Missing required fields: jobTitle, experience, skills" });
    return;
  }

  const cacheKey = `resume:${userId}:${jobTitle}`;
  const cachedResume: string | null = await redis.get(cacheKey);

  if (cachedResume) {
    res.json({ resume: cachedResume, cached: true });
    return;
  }

  const prompt = `Write a professional resume for a ${jobTitle}. Experience: ${experience}. Skills: ${skills}.`;
  const resume: string | null = await generateResume(prompt);

  if (!resume) {
    res.status(500).json({ message: "Failed to generate resume" });
    return;
  }

  await redis.set(cacheKey, resume, "EX", 3600);
  res.json({ resume, cached: false });
};

export const parsePdf = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !req.files.resume) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const file = req.files.resume as fileUpload.UploadedFile;
    const data = await pdfParse(file.data);

    res.json({ text: data.text });
  } catch (error) {
    res.status(500).json({ error: "Error parsing PDF." });
  }
};
