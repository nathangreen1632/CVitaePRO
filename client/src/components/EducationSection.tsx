import React, { useState } from "react";

interface Education {
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
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: "",
    degree: "",
    graduation_year: "",
  });

  const handleChange = (field: keyof Education, value: string) => {
    setCurrentEducation((prev) => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    if (
      currentEducation.institution.trim() ||
      currentEducation.degree.trim() ||
      currentEducation.graduation_year.trim()
    ) {
      setResumeData((prev: any) => ({
        ...prev,
        education: [...prev.education, { ...currentEducation }],
      }));
      setCurrentEducation({ institution: "", degree: "", graduation_year: "" });
    }
  };

  const removeEducation = (index: number) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    setResumeData((prev: any) => ({ ...prev, education: updated }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Education</h3>

      {/* Render existing education entries */}
      {resumeData.education.map((edu, idx) => (
        <div
          key={`${edu.institution}-${edu.degree}-${idx}`}
          className="mb-4 p-4 bg-gray-700 rounded border border-gray-600"
        >
          <p className="text-white font-semibold">{edu.institution}</p>
          <p className="text-white text-sm italic">{edu.degree}</p>
          <p className="text-white text-sm">{edu.graduation_year}</p>
          <button
            type="button"
            onClick={() => removeEducation(idx)}
            className="mt-2 text-red-500 hover:text-red-700 text-sm"
          >
            ❌ Remove Education
          </button>
        </div>
      ))}

      {/* Input fields for new education entry */}
      <div className="bg-gray-700 p-4 rounded border border-gray-600">
        <input
          type="text"
          placeholder="Institution"
          value={currentEducation.institution}
          onChange={(e) => handleChange("institution", e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
        />
        <input
          type="text"
          placeholder="Degree"
          value={currentEducation.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
        />
        <input
          type="text"
          placeholder="Graduation Year"
          value={currentEducation.graduation_year}
          onChange={(e) => handleChange("graduation_year", e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>

      <button
        type="button"
        onClick={addEducation}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ Add Education
      </button>
    </div>
  );
};

export default EducationSection;
