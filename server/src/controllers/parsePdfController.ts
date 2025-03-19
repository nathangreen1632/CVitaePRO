import { Request, Response } from "express";
import { getDocument } from "pdfjs-dist";
import logger from "../register/logger.js";


export const parsePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      logger.warn("No file uploaded.");
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const pdf = await getDocument({ data: new Uint8Array(file.buffer) }).promise;

    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Group text items by Y position (line)
      const lines: Record<number, { str: string; x: number }[]> = {};

      content.items.forEach((item: any) => {
        const y = Math.round(item.transform[5]); // vertical position
        const x = item.transform[4];             // horizontal position

        if (!lines[y]) {
          lines[y] = [];
        }

        lines[y].push({ str: item.str, x });
      });

      // Sort lines by Y descending (top to bottom)
      const sortedLines = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a)
        .map((y) => {
          return lines[y]
            .toSorted((a, b) => a.x - b.x) // sort by X (left to right)
            .map((item) => item.str.trim()) // trim individual words
            .join(' ');
        });

      extractedText += sortedLines.join('\n').replace(/\s{2,}/g, ' ') + '\n\n';
    }


    logger.info("Successfully parsed PDF");
    res.status(200).json({ text: extractedText });
  } catch (error) {
    logger.error(`PDF parsing failed: ${(error as Error).message}`);
    res.status(500).json({ error: "Failed to parse PDF." });
  }
};
