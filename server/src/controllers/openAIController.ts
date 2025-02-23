import { Request, Response } from 'express';
import { callOpenAI } from '../utils/openAIUtils.js';
import { userResumeDirections } from '../prompts/resumeDirections.js';

export const generateResume = async (_req: Request, res: Response): Promise<void> => {
  try {
    const aiResponse = await callOpenAI(userResumeDirections);
    if (!aiResponse) {
      res.status(500).json({ error: 'Failed to generate resume' });
      return;
    }
    res.json({ resume: aiResponse });
  } catch (error) {
    console.error('Resume Generation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
