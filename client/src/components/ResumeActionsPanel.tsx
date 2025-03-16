import React from "react";
import { Link } from "react-router-dom";

interface ResumeActionsPanelProps {
  onEnhance: () => void;
}

const ResumeActionsPanel: React.FC<ResumeActionsPanelProps> = ({ onEnhance }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <button
        onClick={onEnhance}
        className="p-4 min-w-[330px] bg-green-700 text-white text-center rounded hover:bg-green-800"
      >
        Enhance Resume
      </button>

      <Link
        to="/generate-cover-letter"
        className="p-4 min-w-[330px] bg-indigo-600 text-white text-center rounded hover:bg-indigo-800"
      >
        Generate Cover Letter
      </Link>
    </div>
  );
};

export default ResumeActionsPanel;
