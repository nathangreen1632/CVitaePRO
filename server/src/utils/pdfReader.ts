import pdf2json from "pdf2json";
import logger from "../register/logger.js";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();

    pdfParser.on("pdfParser_dataError", (errData) => {
      logger.error("PDF Processing Error:", errData);
      reject(new Error("Failed to extract text from PDF."));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const extractedText = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n");

      resolve(extractedText);
    });

    pdfParser.loadPDF(filePath);
  });
}
