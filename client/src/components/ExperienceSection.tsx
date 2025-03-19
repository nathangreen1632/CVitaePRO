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
        exp.id === id ? {...exp, [field]: value} : exp
      );
      return {...prev, experience: updated};
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
    setResumeData((prev: any) => ({...prev, experience: updated}));
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
      return {...prev, experience: updated};
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
      return {...prev, experience: updated};
    });
  };

  const updateCurrentResponsibility = (id: string, text: string) => {
    setResumeData((prev: any) => {
      const updated = prev.experience.map((exp: Experience) =>
        exp.id === id ? {...exp, currentResponsibility: text} : exp
      );
      return {...prev, experience: updated};
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>

      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md">

          <div className="mb-2">
            <label htmlFor={`company-${exp.id}`} className="text-white block mb-1">Company</label>
            <input
              id={`company-${exp.id}`}
              type="text"
              placeholder="Company name"
              value={exp.company}
              onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="mb-2">
            <label htmlFor={`role-${exp.id}`} className="text-white block mb-1">Role</label>
            <input
              id={`role-${exp.id}`}
              type="text"
              placeholder="Your Job Title"
              value={exp.role}
              onChange={(e) => handleExperienceChange(exp.id, "role", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="flex gap-2 mb-2">
            <div className="w-1/2">
              <label htmlFor={`start-${exp.id}`} className="text-white block mb-1">Start Date</label>
              <input
                id={`start-${exp.id}`}
                type="text"
                placeholder="Start Date"
                value={exp.start_date}
                onChange={(e) => handleExperienceChange(exp.id, "start_date", e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor={`end-${exp.id}`} className="text-white block mb-1">End Date</label>
              <input
                id={`end-${exp.id}`}
                type="text"
                placeholder="End Date"
                value={exp.end_date}
                onChange={(e) => handleExperienceChange(exp.id, "end_date", e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor={`resp-${exp.id}`} className="text-white block mb-1">Responsibility</label>
            <input
              id={`resp-${exp.id}`}
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
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {exp.responsibilities.map((r) => (
              <span
                key={r}
                className="bg-blue-300 dark:bg-gray-900 text-black dark:text-white px-3 py-1 rounded flex items-center gap-2"
              >
              {r}
                <button
                  type="button"
                  className="text-sm hover:text-red-600"
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
            className="text-red-200 shadow-red-200 hover:text-red-600 text-sm"
          >
            ❌ Remove Experience
          </button>
        </div>
      ))}

      <div className="mt-2">
        <button
          type="button"
          onClick={addExperience}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-800"
        >
          ➕ Add Experience
        </button>
      </div>
    </div>
  );
}

export default ExperienceSection;
