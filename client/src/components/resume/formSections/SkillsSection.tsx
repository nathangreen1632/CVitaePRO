import React from 'react';

interface Props {
  resumeData: {
    currentSkill: string;
    skills: string[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const SkillsSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const handleRemoveSkill = (index: number) => {
    setResumeData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: string, i: number) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    if (resumeData.currentSkill?.trim()) {
      setResumeData((prev: any) => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkill.trim()],
        currentSkill: "",
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData((prev: any) => ({
      ...prev,
      currentSkill: e.target.value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && resumeData.currentSkill?.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-2 mt-8">Skills</h3>
      <div className="flex items-center gap-2 mb-2">
        <input
          id="skills-input"
          type="text"
          placeholder="Type a skill and press Enter"
          className="flex-grow px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
          value={resumeData.currentSkill ?? ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="px-3 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-600"
          onClick={handleAddSkill}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill: string, idx: number) => (
          <span
            key={skill + idx}
            className="bg-blue-300 dark:bg-blue-600 text-black dark:text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              className="text-sm hover:text-red-500"
              onClick={() => handleRemoveSkill(idx)}
            >
              ❌
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
