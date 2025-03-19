import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeDetailsForm from "./ResumeDetailsForm.jsx";
import { useDashboardState } from "../hooks/useDashboardState.js";
import { handleGenerateResume } from "../helpers/resumeHandlers.js";

const GenerateResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    resumeData,
    setResumeData,
    handleChange,
    setActivityLog,
    setLoading,
    setError,
  } = useDashboardState();

  const fetchResumes = async () => {
    console.warn("⚠️ fetchResumes called from fallback. You should pass this down if needed.");
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    await handleGenerateResume({
      resumeData,
      setLoading,
      setError,
      setActivityLog,
      fetchResumes,
    });

    setIsGenerating(false);
    navigate("/dashboard");
  };

  return (
    <div className="relative">
      <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <ResumeDetailsForm
          resumeData={resumeData}
          setResumeData={setResumeData}
          handleChange={handleChange}
          handleGenerateResume={handleSubmit}
        />
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="text-white text-lg font-medium">Generating your resume...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateResumeForm;
