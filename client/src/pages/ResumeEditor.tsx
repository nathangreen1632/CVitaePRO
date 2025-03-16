import React, { useState } from "react";
import ResumeUpload from "../components/ResumeUpload.jsx";
import HeaderBar from "../components/HeaderBar.jsx"; // ✅ Centralized Logout & Title

const ResumeEditor: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>("");
  const [enhancedText, setEnhancedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDownload = () => {
    const blob = new Blob([enhancedText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Enhanced_Resume.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setResumeText("");
    setEnhancedText("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <HeaderBar title="Editor Page" />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4">Editor</h2>

        {/* Upload + Buttons */}
        <div className="flex justify-between flex-wrap gap-4 mb-4">
        <ResumeUpload onParse={setResumeText} />
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear Editor
          </button>
          <button
            onClick={handleEnhance}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {loading ? "Enhancing..." : "Enhance"}
          </button>
        </div>


        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Editor */}
        <textarea
          className="w-full h-200 p-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          value={enhancedText || resumeText}
          onChange={(e) => setEnhancedText(e.target.value)}
        />

        {/* Download */}
        {enhancedText && (
          <div className="text-center mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Download Enhanced
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
