// Handles skills as a comma-separated list input
import React from 'react';

interface Props {
  resumeData: {
    skills: string[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const SkillsSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const handleSkillsChange = (value: string) => {
    const parsed = value
      .split(',')
      .map((skill) => skill.trim())
      .filter((s) => s.length > 0);

    setResumeData((prev: any) => ({ ...prev, skills: parsed }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Skills</h3>
      <input
        type="text"
        value={resumeData.skills.join(', ')}
        onChange={(e) => handleSkillsChange(e.target.value)}
        placeholder="e.g. JavaScript, React, Node.js"
        className="w-full p-3 bg-gray-700 rounded-lg text-white"
      />
    </div>
  );
};

export default SkillsSection;
