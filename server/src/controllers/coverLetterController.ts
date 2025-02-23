import { Request, Response } from 'express';
import { callOpenAI } from '../utils/openAIUtils.js';
import { coverLetterPrompt } from '../prompts/coverLetterDirections.js';

export const generateCoverLetter = async (_req: Request, res: Response): Promise<void> => {
  try {
    const aiResponse = await callOpenAI(coverLetterPrompt);
    if (!aiResponse) {
      res.status(500).json({ error: 'Failed to generate cover letter' });
      return;
    }
    res.json({ coverLetter: aiResponse });
  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
