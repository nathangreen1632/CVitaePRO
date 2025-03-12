import React from "react";
import { Link } from "react-router-dom";

interface ResumeActionsPanelProps {
  onGenerate: () => void;
  onEnhance: () => void;
}

const ResumeActionsPanel: React.FC<ResumeActionsPanelProps> = ({ onGenerate, onEnhance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <button className="p-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600">
        Upload Resume
      </button>

      <button
        onClick={onGenerate}
        className="p-4 bg-purple-500 text-white text-center rounded hover:bg-purple-600"
      >
        Generate Resume
      </button>

      <button
        onClick={onEnhance}
        className="p-4 bg-green-500 text-white text-center rounded hover:bg-green-600"
      >
        Enhance Resume
      </button>

      <Link
        to="/generate-cover-letter"
        className="p-4 bg-indigo-500 text-white text-center rounded hover:bg-indigo-600"
      >
        Generate Cover Letter
      </Link>
    </div>
  );
};

export default ResumeActionsPanel;
