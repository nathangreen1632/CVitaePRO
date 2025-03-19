import React, { useState } from "react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  graduation_year: string;
}

interface Props {
  resumeData: {
    education: Education[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const EducationSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const [currentEducation, setCurrentEducation] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    graduation_year: "",
  });

  const handleChange = (field: keyof Omit<Education, "id">, value: string) => {
    setCurrentEducation((prev) => ({...prev, [field]: value}));
  };

  const addEducation = () => {
    if (
      currentEducation.institution.trim() ||
      currentEducation.degree.trim() ||
      currentEducation.graduation_year.trim()
    ) {
      setResumeData((prev: any) => ({
        ...prev,
        education: [
          ...prev.education,
          {
            id: crypto.randomUUID(),
            ...currentEducation,
          },
        ],
      }));
      setCurrentEducation({
        institution: "",
        degree: "",
        graduation_year: "",
      });
    }
  };

  const removeEducation = (id: string) => {
    const updated = resumeData.education.filter((edu: Education) => edu.id !== id);
    setResumeData((prev: any) => ({...prev, education: updated}));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Education</h3>

      {resumeData.education.map((edu) => (
        <div
          key={edu.id}
          className="mb-4 p-4 bg-gray-700 rounded border border-gray-600"
        >
          <p className="text-white font-semibold">{edu.institution}</p>
          <p className="text-white text-sm italic">{edu.degree}</p>
          <p className="text-white text-sm">{edu.graduation_year}</p>
          <button
            type="button"
            onClick={() => removeEducation(edu.id)}
            className="mt-2 text-red-200 shadow-red-200 hover:text-red-600 text-sm"
          >
            ❌ Remove Education
          </button>
        </div>
      ))}

      <div className="bg-gray-700 p-4 rounded border border-gray-600">
        <div className="mb-2">
          <label htmlFor="institution" className="text-white block mb-1">Institution</label>
          <input
            id="institution"
            type="text"
            placeholder="Institution"
            value={currentEducation.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="degree" className="text-white block mb-1">Degree</label>
          <input
            id="degree"
            type="text"
            placeholder="Degree"
            value={currentEducation.degree}
            onChange={(e) => handleChange("degree", e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="graduation_year" className="text-white block mb-1">Graduation Year</label>
          <input
            id="graduation_year"
            type="text"
            placeholder="Graduation Year (i.e. 2025)"
            value={currentEducation.graduation_year}
            onChange={(e) => handleChange("graduation_year", e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addEducation}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-800"
      >
        ➕ Add Education
      </button>
    </div>
  );
}

export default EducationSection;
