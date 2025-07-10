import pdf2json from "pdf2json";
import logger from "../register/logger.js";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();

    pdfParser.on("pdfParser_dataError", (errData): void => {
      logger.error("PDF Processing Error:", errData);
      reject(new Error("Failed to extract text from PDF."));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const pageTexts: string[] = [];
      for (const page of pdfData.Pages) {
        const textChunks: string[] = [];
        for (const t of page.Texts) {
          const decoded = decodeURIComponent(t.R[0].T);
          textChunks.push(decoded);
        }
        pageTexts.push(textChunks.join(" "));
      }
      const extractedText = pageTexts.join("\n");
      resolve(extractedText);
    });


    pdfParser.loadPDF(filePath);
  });
}
