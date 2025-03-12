import React from "react";

interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

interface ExperienceSectionProps {
  resumeData: {
    experience: Experience[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ resumeData, setResumeData }) => {
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...resumeData.experience];
    if (field === "responsibilities") {
      updated[index][field] = value.split("\n");
    } else {
      updated[index][field] = value;
    }
    setResumeData((prev: any) => ({ ...prev, experience: updated }));
  };

  const handleResponsibilitiesChange = (index: number, value: string) => {
    const updated = [...resumeData.experience];
    updated[index].responsibilities = value.split("\n");
    setResumeData((prev: any) => ({ ...prev, experience: updated }));
  };

  const addExperience = () => {
    const newEntry = {
      company: "",
      role: "",
      start_date: "",
      end_date: "",
      responsibilities: [""],
    };
    setResumeData((prev: any) => ({
      ...prev,
      experience: [...prev.experience, newEntry],
    }));
  };

  const removeExperience = (index: number) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);
    setResumeData((prev: any) => ({ ...prev, experience: updated }));
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>

      {resumeData.experience.map((exp, index) => (
        <div key={index} className="space-y-2 bg-gray-700 p-4 rounded-lg mb-4">
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={exp.start_date}
            onChange={(e) => handleExperienceChange(index, "start_date", e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="date"
            placeholder="End Date"
            value={exp.end_date}
            onChange={(e) => handleExperienceChange(index, "end_date", e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <textarea
            placeholder="Responsibilities (one per line)"
            value={exp.responsibilities.join("\n")}
            onChange={(e) => handleResponsibilitiesChange(index, e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove Experience
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="mt-2 px-4 py-2 bg-blue-500 rounded text-white"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
