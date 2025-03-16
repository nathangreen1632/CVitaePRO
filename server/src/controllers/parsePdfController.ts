// server/src/controllers/parsePdfController.ts
import { Request, Response } from "express";
import pdfParse from "pdf-parse";
import logger from "../register/logger.js";

export const parsePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      logger.warn("❌ No file uploaded.");
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const data = await pdfParse(file.buffer);
    logger.info("✅ Successfully parsed PDF");
    res.status(200).json({ text: data.text });
  } catch (error) {
    logger.error(`❌ PDF parsing failed: ${(error as Error).message}`);
    res.status(500).json({ error: "Failed to parse PDF." });
  }
};
