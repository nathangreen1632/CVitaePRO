import React from "react";


interface ResumeActionsPanelProps {
  onGenerate: () => void | Promise<void>;
  onEnhance: () => void | Promise<void>; // ✅ ADD THIS LINE
}


const ResumeActionsPanel: React.FC<ResumeActionsPanelProps> = ({ onGenerate, onEnhance }) => {
  return (
    <div className="flex gap-4 mt-6 justify-center">
      <button
        onClick={onGenerate}
        className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition"
      >
        Generate Resume
      </button>

      <button
        onClick={onEnhance}
        className="bg-purple-600 hover:bg-purple-800 text-white font-medium py-2 px-6 rounded-lg transition"
      >
        Enhance Resume
      </button>
    </div>
  );
};

export default ResumeActionsPanel;

