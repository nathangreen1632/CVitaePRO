// Handles dynamic education input
import React from 'react';

interface EducationEntry {
  institution: string;
  degree: string;
  graduation_year: string;
}

interface Props {
  resumeData: {
    education: EducationEntry[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const EducationSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const handleEducationChange = (
    index: number,
    field: keyof EducationEntry,
    value: string
  ) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;
    setResumeData((prev: any) => ({ ...prev, education: updated }));
  };

  const addEducation = () => {
    setResumeData((prev: any) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', graduation_year: '' },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    const updated = [...resumeData.education];
    updated.splice(index, 1);
    setResumeData((prev: any) => ({ ...prev, education: updated }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Education</h3>
      {resumeData.education.map((edu, index) => (
        <div key={index} className="space-y-2 bg-gray-700 p-4 rounded-lg mb-4">
          <input
            type="text"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="Graduation Year"
            value={edu.graduation_year}
            onChange={(e) => handleEducationChange(index, 'graduation_year', e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="text-red-400 hover:underline"
          >
            Remove Education
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addEducation}
        className="mt-2 px-4 py-2 bg-blue-500 rounded text-white"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationSection;
