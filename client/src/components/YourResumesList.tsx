import React from "react";
import ResumeCard from "../pages/ResumeCard.jsx";
import ATSScoreBreakdown from "./ATSScoreBreakdown";

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  jobTitle: string;
  resumeSnippet: string;
  experience: {
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    responsibilities: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    graduation_year: string;
  }[];
  skills: string[];
  certifications: {
    name: string;
    year: string;
  }[];
}

interface Score {
  atsScore: number;
  keywordMatch: number;
  softSkillsMatch: number;
  industryTermsMatch: number;
  formattingErrors: string[];
}

interface Props {
  resumes: Resume[];
  loading: boolean;
  atsScores: Record<string, Score>;
  jobDescriptions: Record<string, string>;
  setJobDescriptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleScoreResume: (resumeId: string, resumeSnippet: string) => void;
  fetchResumes: () => Promise<void>;
}

const YourResumesList: React.FC<Props> = ({
                                            resumes,
                                            loading,
                                            atsScores,
                                            jobDescriptions,
                                            setJobDescriptions,
                                            handleScoreResume,
                                            fetchResumes,
                                          }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Your Resumes</h3>
      {loading ? (
        <p className="text-center text-gray-400">Loading resumes...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div key={resume.id}>
              <ResumeCard
                id={resume.id}
                name={resume.name || "Untitled Resume"}
                jobTitle={resume.jobTitle || "N/A"}
                resumeSnippet={resume.resumeSnippet || ""}
                summary={resume.summary || ""}
                experience={resume.experience || []}
                education={resume.education || []}
                skills={resume.skills || []}
                certifications={resume.certifications || []}
                refreshResumes={fetchResumes}
              />

              {/* Job Description */}
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Description
                </label>
                <textarea
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Paste the job description here..."
                  value={jobDescriptions[resume.id] || ""}
                  onChange={(e) =>
                    setJobDescriptions((prev) => ({
                      ...prev,
                      [resume.id]: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Score Resume Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleScoreResume(resume.id, resume.resumeSnippet)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Score Resume
                </button>
              </div>

              {/* ATS Score Breakdown */}
              {atsScores[resume.id] && (
                <ATSScoreBreakdown
                  atsScore={atsScores[resume.id].atsScore}
                  keywordMatch={atsScores[resume.id].keywordMatch}
                  softSkillsMatch={atsScores[resume.id].softSkillsMatch}
                  industryTermsMatch={atsScores[resume.id].industryTermsMatch}
                  formattingErrors={atsScores[resume.id].formattingErrors}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourResumesList;
