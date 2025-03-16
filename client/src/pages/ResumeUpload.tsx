import React, { useState } from "react";
import mammoth from "mammoth";

const ResumeUpload: React.FC<{ onParse: (text: string) => void }> = ({ onParse }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // ✅ Parse DOCX in the browser
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const docxData = await mammoth.extractRawText({ arrayBuffer });
          onParse(docxData.value);
        } catch {
          setError("Failed to parse DOCX. Please try again.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/pdf") {
      // ✅ Send PDFs to the backend instead
      await uploadToBackend(file);
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX.");
    }
  };

  const uploadToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend parsing failed");

      const data = await response.json();
      onParse(data.text);
    } catch {
      setError("Error parsing document. Please try again.");
    }
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