import React from "react";
import ResumeDetailsForm from "./ResumeDetailsForm.jsx";
import { useDashboardState } from "../hooks/useDashboardState.js";
import { handleGenerateResume } from "../helpers/resumeHandlers.js";

const GenerateResumeForm: React.FC = () => {
  const {
    resumeData,
    setResumeData,
    handleChange,
    setActivityLog,
    setLoading,
    setError,
  } = useDashboardState();

  const fetchResumes = async () => {
    // Safety fallback if not available from props
    console.warn("⚠️ fetchResumes called from fallback. You should pass this down if needed.");
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Resume Details (Auto-Sync)</h2>

      <ResumeDetailsForm
        resumeData={resumeData}
        setResumeData={setResumeData}
        handleChange={handleChange}
        handleGenerateResume={() =>
          handleGenerateResume({
            resumeData,
            setLoading,
            setError,
            setActivityLog,
            fetchResumes,
          })
        }
      />
    </div>
  );
};

export default GenerateResumeForm;
