import { Document, Packer, Paragraph, TextRun } from "docx";

export const generateCoverLetterDocx = async (coverLetter: string): Promise<Buffer> => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: coverLetter.split("\n").map(line =>
          new Paragraph({
            children: [new TextRun(line)],
          })
        ),
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
