import React, { useEffect } from "react";

interface Experience {
  id: string;
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
  // Ensure at least one experience with an ID
  useEffect(() => {
    if (resumeData.experience.length === 0) {
      setResumeData((prev: any) => ({
        ...prev,
        experience: [
          {
            id: crypto.randomUUID(),
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
    id: string,
    field: keyof Omit<Experience, "id" | "responsibilities" | "currentResponsibility">,
    value: string
  ) => {
    setResumeData((prev: any) => {
      const updated = prev.experience.map((exp: Experience) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setResumeData((prev: any) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: crypto.randomUUID(),
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

  const removeExperience = (id: string) => {
    const updated = resumeData.experience.filter((exp) => exp.id !== id);
    setResumeData((prev: any) => ({ ...prev, experience: updated }));
  };

  const updateResponsibility = (id: string, text: string) => {
    setResumeData((prev: any) => {
      const updated = prev.experience.map((exp: Experience) =>
        exp.id === id
          ? {
            ...exp,
            responsibilities: [...exp.responsibilities, text],
            currentResponsibility: "",
          }
          : exp
      );
      return { ...prev, experience: updated };
    });
  };

  const removeResponsibility = (id: string, text: string) => {
    setResumeData((prev: any) => {
      const updated = prev.experience.map((exp: Experience) =>
        exp.id === id
          ? {
            ...exp,
            responsibilities: exp.responsibilities.filter((item) => item !== text),
          }
          : exp
      );
      return { ...prev, experience: updated };
    });
  };

  const updateCurrentResponsibility = (id: string, text: string) => {
    setResumeData((prev: any) => {
      const updated = prev.experience.map((exp: Experience) =>
        exp.id === id ? { ...exp, currentResponsibility: text } : exp
      );
      return { ...prev, experience: updated };
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>

      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md">
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => handleExperienceChange(exp.id, "role", e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Start Date"
              value={exp.start_date}
              onChange={(e) => handleExperienceChange(exp.id, "start_date", e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="End Date"
              value={exp.end_date}
              onChange={(e) => handleExperienceChange(exp.id, "end_date", e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <input
            type="text"
            placeholder="Responsibility (press Enter to add)"
            value={exp.currentResponsibility ?? ""}
            onChange={(e) => updateCurrentResponsibility(exp.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && exp.currentResponsibility?.trim()) {
                e.preventDefault();
                updateResponsibility(exp.id, exp.currentResponsibility.trim());
              }
            }}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex flex-wrap gap-2 mb-2">
            {exp.responsibilities.map((r) => (
              <span
                key={r}
                className="bg-blue-300 dark:bg-gray-900 text-black dark:text-white px-3 py-1 rounded flex items-center gap-2"
              >
                {r}
                <button
                  type="button"
                  className="text-sm hover:text-red-500"
                  onClick={() => removeResponsibility(exp.id, r)}
                >
                  ❌
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => removeExperience(exp.id)}
            className="text-red-300 hover:text-red-700 text-sm"
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
