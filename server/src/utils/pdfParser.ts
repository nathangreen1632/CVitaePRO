import pdf2json from "pdf2json";

export const parsePdf = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();
    pdfParser.loadPDF(filePath);

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(new Error(`PDF Parsing Error: ${errData.parserError}`));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = extractTextFromPdfData(pdfData);
      resolve(text || "");
    });
  });
};

const extractTextFromPdfData = (pdfData: any): string => {
  if (!pdfData?.Pages) return "";

  return pdfData.Pages.map((page: { Texts: { R: { T: string }[] }[] }) =>
    page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(" ")
  ).join("\n");
};
