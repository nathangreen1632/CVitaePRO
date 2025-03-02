import pdf2json from "pdf2json";
import logger from "../register/logger.js";
/**
 * Extracts text from a PDF file using pdf2json.
 * @param {string} filePath - Path to the uploaded PDF file.
 * @returns {Promise<string>} - Extracted raw text.
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();

    pdfParser.on("pdfParser_dataError", (errData) => {
      logger.error("PDF Processing Error:", errData);
      reject(new Error("Failed to extract text from PDF."));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // Extract text from the PDF JSON structure
      const extractedText = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n");

      resolve(extractedText);
    });

    // Load the PDF file
    pdfParser.loadPDF(filePath);
  });
}
