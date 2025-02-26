import { Request, Response } from "express";
import { calculateATSScore, matchKeywords } from "../services/atsService.js";

export const scoreResume = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, formattingErrors } = req.body;

    if (!resumeText || !jobDescription || !Array.isArray(formattingErrors)) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: resumeText, jobDescription, or formattingErrors",
      });
    }

    const keywordMatch = matchKeywords(resumeText, jobDescription);
    const score = calculateATSScore(keywordMatch, formattingErrors);

    res.status(200).json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error scoring resume", error });
  }
};
