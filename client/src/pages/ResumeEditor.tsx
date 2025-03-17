import React, { useState, useRef } from "react";
import ResumeUpload from "../components/ResumeUpload.jsx";
import HeaderBar from "../components/HeaderBar.jsx"; // ✅ Centralized Logout & Title

const ResumeEditor: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>("");
  const [enhancedText, setEnhancedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<string>("Downloading...");


  const handleEnhance = async () => {
    if (!resumeText.trim()) {
      setError("Please upload and parse a resume first.");
      return;
    }

    setLoading(true);
    setError(null);
    setEnhancedText("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/openai/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeData: {
            summary: resumeText,
            experience: [],
            education: [],
            skills: [],
            certifications: [],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to enhance resume.");
        return;
      }

      setEnhancedText(data.resume?.summary || "");
    } catch (err) {
      setError("Server error or network issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async () => {
    if (!resumeText.trim()) {
      setError("Please upload and parse a resume first.");
      return;
    }

    setLoading(true);
    setError(null);
    setEnhancedText("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/openai/expand-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rawText: resumeText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to expand resume.");
        return;
      }

      setEnhancedText(data.enhancedText || "");
    } catch (err) {
      setError("Server error or network issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setError(null);
    setIsDownloading(true);
    setDownloadMessage("Downloading PDF...");

    const payload = {
      resume: enhancedText || resumeText,
      name: "Resume", // Or add a name input if needed
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/resume/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("Content-Type");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Failed to download PDF.");
        return;
      }

      if (!contentType?.includes("application/pdf")) {
        setError("Unexpected content. Expected a PDF.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Enhanced_Resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Could not download PDF.");
    }
    setIsDownloading(false);
  };

  const handleDownloadDocx = async () => {
    setError(null);
    setIsDownloading(true);
    setDownloadMessage("Downloading DOCX...");

    const payload = {
      resume: enhancedText || resumeText,
      name: "Resume", // Optional
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/resume/download-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Failed to download DOCX.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Enhanced_Resume.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX download error:", err);
      setError("Could not download DOCX.");
    }
    setIsDownloading(false);
  };


  const handleClear = () => {
    setResumeText("");
    setEnhancedText("");
    setError(null);
    if (uploadRef.current) uploadRef.current.value = ""; // ✅ clear file input
  };

  const sharedButtonClass = "min-w-[10rem] text-center font-semibold px-4 py-2 rounded-lg";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <HeaderBar title="Editor Page" />

      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-white font-medium text-lg">Working. Please wait...</p>
          </div>
        </div>
      )}

      {isDownloading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-white font-medium text-lg">{downloadMessage}</p>
          </div>
        </div>
      )}


      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4">Editor</h2>

        {/* Upload + Buttons */}
        <div className="flex justify-between flex-wrap gap-4 mb-4">

          <ResumeUpload onParse={setResumeText} inputRef={uploadRef as React.RefObject<HTMLInputElement>} /> {/* ✅ Pass ref here */}

          <button
            onClick={handleClear}
            className={`${sharedButtonClass} bg-red-700 text-white hover:bg-red-900`}
          >
            {loading ? "Clearing..." : "Clear Editor"}
          </button>

          <button
            onClick={handleEnhance}
            className={`${sharedButtonClass} bg-green-700 text-white hover:bg-green-900`}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
          <button
            onClick={handleExpand}
            className={`${sharedButtonClass} bg-yellow-600 text-white hover:bg-yellow-800`}
          >
            {loading ? "Expanding..." : "Enhance"}
          </button>

        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <textarea
          className="w-full h-200 p-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          value={enhancedText || resumeText}
          onChange={(e) => setEnhancedText(e.target.value)}
          aria-label="Resume and cover letter editor. Enter or modify your content here."
        />


        {enhancedText && (
          <div className="text-center mt-4 space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={handleDownloadDocx}
              className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded"
            >
              Download DOCX
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
