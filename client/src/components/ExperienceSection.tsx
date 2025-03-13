import React, { useEffect } from "react";

interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
  currentResponsibility?: string;
}

interface Props {
  resumeData: {
    experience: Experience[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const ExperienceSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  useEffect(() => {
    if (resumeData.experience.length === 0) {
      setResumeData((prev: any) => ({
        ...prev,
        experience: [
          {
            company: "",
            role: "",
            start_date: "",
            end_date: "",
            responsibilities: [],
            currentResponsibility: "",
          },
        ],
      }));
    }
  }, [resumeData.experience, setResumeData]);

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setResumeData((prev: any) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setResumeData((prev: any) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          role: "",
          start_date: "",
          end_date: "",
          responsibilities: [],
          currentResponsibility: "",
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);
    setResumeData((prev: any) => ({ ...prev, experience: updated }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>

      {resumeData.experience.map((exp, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md">
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Start Date"
              value={exp.start_date}
              onChange={(e) => handleExperienceChange(index, "start_date", e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="End Date"
              value={exp.end_date}
              onChange={(e) => handleExperienceChange(index, "end_date", e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <input
            type="text"
            placeholder="Responsibility (press Enter to add)"
            value={exp.currentResponsibility || ""}
            onChange={(e) => {
              const updated = [...resumeData.experience];
              updated[index].currentResponsibility = e.target.value;
              setResumeData((prev: any) => ({ ...prev, experience: updated }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && exp.currentResponsibility?.trim()) {
                e.preventDefault();
                const updated = [...resumeData.experience];
                updated[index].responsibilities.push(exp.currentResponsibility.trim());
                updated[index].currentResponsibility = "";
                setResumeData((prev: any) => ({ ...prev, experience: updated }));
              }
            }}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex flex-wrap gap-2 mb-2">
            {exp.responsibilities.map((r, ridx) => (
              <span
                key={ridx}
                className="bg-blue-300 dark:bg-blue-600 text-black dark:text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {r}
                <button
                  type="button"
                  className="text-sm hover:text-red-500"
                  onClick={() => {
                    const updated = [...resumeData.experience];
                    updated[index].responsibilities = updated[index].responsibilities.filter((_, i) => i !== ridx);
                    setResumeData((prev: any) => ({ ...prev, experience: updated }));
                  }}
                >
                  ❌
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ❌ Remove Experience
          </button>
        </div>
      ))}

      <div className="mt-2">
        <button
          type="button"
          onClick={addExperience}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceSection;
