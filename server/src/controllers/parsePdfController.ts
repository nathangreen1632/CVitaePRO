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

      const lines: Record<number, { str: string; x: number }[]> = {};

      content.items.forEach((item: any) => {
        const y = Math.round(item.transform[5]);
        const x = item.transform[4];

        if (!lines[y]) {
          lines[y] = [];
        }

        lines[y].push({ str: item.str, x });
      });

      const sortedLines = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a)
        .map((y) => {
          return lines[y]
            .toSorted((a, b) => a.x - b.x)
            .map((item) => item.str.trim())
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
