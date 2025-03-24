import React from 'react';
import ExperienceSection from './ExperienceSection.jsx';
import EducationSection from './EducationSection.jsx';
import SkillsSection from './SkillsSection.jsx';
import CertificationsSection from './CertificationsSection.jsx';

interface ResumeDetailsFormProps {
  resumeData: any;
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleGenerateResume: () => void;
}

const ResumeDetailsForm: React.FC<ResumeDetailsFormProps> = ({ resumeData, setResumeData, handleChange, handleGenerateResume }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg mx-auto mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">Resume Details</h2>

      {['name', 'email', 'phone', 'linkedin', 'portfolio', 'summary'].map((field) => (
        <label key={field} className="block mb-3">
          <span className="text-gray-300 capitalize">{field.replace('_', ' ')}</span>
          {field === 'summary' ? (
            <textarea
              name={field}
              value={resumeData[field]}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg text-white"
            />
          ) : (
            <input
              type="text"
              name={field}
              value={resumeData[field]}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg text-white"
            />
          )}
        </label>
      ))}

      <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
      <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
      <SkillsSection resumeData={resumeData} setResumeData={setResumeData} />
      <CertificationsSection resumeData={resumeData} setResumeData={setResumeData} />

      <label className="block mb-3 mt-6">
        <span className="text-gray-300">Job Description</span>
        <textarea
          name="jobDescription"
          value={resumeData.jobDescription || ""}
          onChange={handleChange}
          placeholder="Paste the job description here to optimize your resume..."
          rows={6}
          className="w-full p-3 bg-gray-700 rounded-lg text-white"
        />
      </label>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleGenerateResume}
          className="bg-green-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-900 transition"
        >
          Generate Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeDetailsForm;
