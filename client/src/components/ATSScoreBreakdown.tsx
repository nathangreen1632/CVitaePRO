import React from "react";

interface ATSScoreBreakdownProps {
  atsScore: number;
  keywordMatch: number;
  softSkillsMatch: number;
  industryTermsMatch: number;
  formattingErrors: string[];
}

const ProgressBar: React.FC<{ label: string; value: number; max: number }> = ({
                                                                                label,
                                                                                value,
                                                                                max,
                                                                              }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400 text-sm">{percentage}%</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-lg overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ATSScoreBreakdown: React.FC<ATSScoreBreakdownProps> = ({
                                                               atsScore,
                                                               keywordMatch,
                                                               softSkillsMatch,
                                                               industryTermsMatch,
                                                               formattingErrors,
                                                             }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 w-full max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">ATS Score Breakdown</h2>

      <div className="flex justify-center mb-6">
        <span className="text-5xl font-bold text-green-400">{Math.round(atsScore)}%</span>
      </div>

      <ProgressBar label="Keyword Match" value={keywordMatch} max={30} />
      <ProgressBar label="Soft Skills Match" value={softSkillsMatch} max={28} />
      <ProgressBar label="Industry Terms Match" value={industryTermsMatch} max={20} />

      {formattingErrors.length > 0 && (
        <div className="mt-6 bg-red-800/40 p-4 rounded-lg border border-red-500">
          <h3 className="text-red-400 font-semibold mb-2">Formatting Issues:</h3>
          <ul className="list-disc list-inside text-sm text-red-300">
            {formattingErrors.map((error) => (
              <li key={crypto.randomUUID()}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {formattingErrors.length === 0 && (
        <p className="mt-6 text-sm text-green-400 text-center">No formatting issues detected. ✅</p>
      )}
    </div>
  );
};

export default ATSScoreBreakdown;
