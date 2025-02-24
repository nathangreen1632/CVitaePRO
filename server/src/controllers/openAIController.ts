import { Request, Response } from 'express';
import { callOpenAI } from '../utils/openAIService.js';
import { userResumeDirections } from '../prompts/resumeDirections.js';

export const generateResume = async (_req: Request, res: Response): Promise<void> => {
  try {
    const aiResponse = await callOpenAI({
      model: "gpt-4o",
      messages: [{ role: "system", content: userResumeDirections }]
    });
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
