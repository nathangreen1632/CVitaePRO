import { Request, Response } from "express";
import { generateCoverLetterService, enhanceResumeService } from "../services/openAIService.js";

export const generateCoverLetter = async (req: Request, res: Response) => {
  console.log('Route hit for generateCoverLetter');
  try {
    const coverLetter = await generateCoverLetterService(req.body);
    res.status(200).json({ success: true, coverLetter });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating cover letter", error });
  }
};

export const enhanceResume = async (req: Request, res: Response) => {
  try {
    const enhancedResume = await enhanceResumeService(req.body);
    res.status(200).json({ success: true, enhancedResume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error enhancing resume", error });
  }
};