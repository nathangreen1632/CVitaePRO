import React from 'react';

interface Props {
  resumeData: {
    currentSkill: "";
    skills: string[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const SkillsSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-2 mt-8">Skills</h3>
      <div className="flex items-center gap-2 mb-2">
        <input
          id="skills-input"
          type="text"
          placeholder="Type a skill and press Enter"
          className="flex-grow px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
          value={resumeData.currentSkill || ""}
          onChange={(e) =>
            setResumeData((prev: any) => ({
              ...prev,
              currentSkill: e.target.value,
            }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && resumeData.currentSkill?.trim()) {
              e.preventDefault();
              setResumeData((prev: any) => ({
                ...prev,
                skills: [...prev.skills, prev.currentSkill.trim()],
                currentSkill: "",
              }));
            }
          }}
        />
        <button
          type="button"
          className="px-3 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-600"
          onClick={() => {
            if (resumeData.currentSkill?.trim()) {
              setResumeData((prev: any) => ({
                ...prev,
                skills: [...prev.skills, prev.currentSkill.trim()],
                currentSkill: "",
              }));
            }
          }}
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
              onClick={() =>
                setResumeData((prev: any) => ({
                  ...prev,
                  skills: prev.skills.filter((_: string, i: number) => i !== idx),
                }))
              }
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
