import React, { useState, RefObject } from "react";
import mammoth from "mammoth";

interface ResumeUploadProps {
  onParse: (text: string) => void;
  inputRef?: RefObject<HTMLInputElement>; // ✅ Add this line
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onParse, inputRef }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const docxData = await mammoth.extractRawText({ arrayBuffer });
          onParse(docxData.value);
        } catch {
          setError("Failed to parse DOCX. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/pdf") {
      try {
        await uploadToBackend(file);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX.");
      setLoading(false);
    }
  };

  const uploadToBackend = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/resume/parse-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Backend parsing failed");

    const data = await response.json();
    onParse(data.text);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept=".pdf,.docx"
        ref={inputRef} // ✅ Forward the ref
        onChange={handleFileUpload}
        className="hidden"
        id="resume-upload"
      />
      <label
        htmlFor="resume-upload"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
      >
        {loading ? "Parsing..." : "Upload Document"}
      </label>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
