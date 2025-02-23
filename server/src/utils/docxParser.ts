import fs from "fs";
import mammoth from "mammoth";

export const parseDocx = async (filePath: string): Promise<string> => {
  try {
    const data = await fs.promises.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: data });
    return result.value.trim();
  } catch (error) {
    throw new Error(`DOCX Parsing Error: ${error}`);
  }
};
