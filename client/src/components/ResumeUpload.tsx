// File: client/src/components/ResumeUpload.tsx

import React, { useState } from "react";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const ResumeUpload: React.FC<{ onParse: (text: string) => void }> = ({ onParse }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const pdfData = await pdfParse(buffer);
          onParse(pdfData.text);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const docxData = await mammoth.extractRawText({ arrayBuffer });
          onParse(docxData.value);
        } else {
          setError("Unsupported file format. Please upload a PDF or DOCX.");
        }
      } catch {
        setError("Failed to parse the document. Please try again.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" id="resume-upload" />
      <label htmlFor="resume-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Upload Resume
      </label>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
