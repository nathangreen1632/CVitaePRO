import { Request, Response } from 'express';

declare module 'express' {
  export interface Request {
    user?: string;
  }
}
import redis from '../cache/redisCache.js';
import { generateResume } from '../services/openAIService.js';

export const generateResumeHandler = async (req: Request, res: Response): Promise<void> => {
  const { jobTitle, experience, skills } = req.body;
  const userId = req.user!;

  if (!jobTitle || !experience || !skills) {
    res.status(400).json({ message: 'Missing required fields: jobTitle, experience, skills' });
    return;
  }

  const cacheKey = `resume:${userId}:${jobTitle}`;
  const cachedResume = await redis.get(cacheKey);

  if (cachedResume) {
    res.json({ resume: cachedResume, cached: true });
    return;
  }

  const prompt = `Write a professional resume for a ${jobTitle}. Experience: ${experience}. Skills: ${skills}.`;
  const resume = await generateResume(prompt);

  if (!resume) {
    res.status(500).json({ message: 'Failed to generate resume' });
    return;
  }

  await redis.set(cacheKey, resume, 'EX', 3600);
  res.json({ resume, cached: false });
};
