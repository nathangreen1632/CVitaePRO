import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeDetailsForm from "../formSections/ResumeDetailsForm.tsx";
import { useDashboardState } from "../../../hooks/useDashboardState.ts";
import { handleGenerateResume } from "../../../helpers/resumeHandlers.ts";

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
          <div className="flex flex-col items-center space-y-4">
            {/* Bouncing Dots Row */}
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-red-500 rounded-full"
                  style={{
                    animation: `highBounce 0.8s ease-in-out ${i * 0.7}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Loading Text Below */}
            <p className="text-white font-medium text-lg">Generating Your Resume...</p>
          </div>

          <style>
            {`
                @keyframes highBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-24px); }
                }
              `}
          </style>
        </div>
      )}
    </div>
  );
};

export default GenerateResumeForm;
