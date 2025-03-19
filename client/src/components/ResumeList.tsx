import React, { useState } from "react";
import ResumeCard from "../pages/ResumeCard.jsx";
import ATSScoreBreakdown from "./ATSScoreBreakdown.jsx";
import { convertResumeToHTML } from "../helpers/convertResumeToHTML";

interface ResumeListProps {
  resumes: {
    id: string;
    name: string;
    jobTitle: string;
    resumeSnippet: string;
    summary: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
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
  }[];
  jobDescriptions: Record<string, string>;
  setJobDescriptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  atsScores: Record<
    string,
    {
      atsScore: number;
      keywordMatch: number;
      softSkillsMatch: number;
      industryTermsMatch: number;
      formattingErrors: string[];
    }
  >;
  setAtsScores: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          atsScore: number;
          keywordMatch: number;
          softSkillsMatch: number;
          industryTermsMatch: number;
          formattingErrors: string[];
        }
      >
    >
  >;
  handleScoreResume: (params: {
    resumeId: string;
    htmlResume: string;
    jobDescription: string;
    setAtsScores: React.Dispatch<
      React.SetStateAction<
        Record<
          string,
          {
            atsScore: number;
            keywordMatch: number;
            softSkillsMatch: number;
            industryTermsMatch: number;
            formattingErrors: string[];
          }
        >
      >
    >;
  }) => Promise<void>;
  refreshResumes: () => void;
}

const ResumeList: React.FC<ResumeListProps> = ({
                                                 resumes,
                                                 jobDescriptions,
                                                 setJobDescriptions,
                                                 handleScoreResume,
                                                 atsScores,
                                                 setAtsScores,
                                                 refreshResumes,
                                               }) => {
  const [loadingScore, setLoadingScore] = useState<Record<string, boolean>>({});

  const handleScore = async (resumeId: string, htmlResume: string, jobDescription: string) => {
    setLoadingScore((prev) => ({ ...prev, [resumeId]: true }));

    await handleScoreResume({
      resumeId,
      htmlResume,
      jobDescription,
      setAtsScores,
    });

    setLoadingScore((prev) => ({ ...prev, [resumeId]: false }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Your Resumes</h3>

      {resumes.length === 0 ? (
        <p className="text-center text-gray-400">No resumes found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {resumes.map((resume) => (
            <div key={resume.id} id={`resume-${resume.id}-${resume.name.replace(/\s+/g, "-")}`}>
              <ResumeCard
                id={resume.id}
                name={resume.name || "Untitled Resume"}
                resumeSnippet={resume.resumeSnippet || ""}
                summary={resume.summary || ""}
                email={resume.email || ""}
                phone={resume.phone || ""}
                linkedin={resume.linkedin || ""}
                portfolio={resume.portfolio || ""}
                experience={resume.experience || []}
                education={resume.education || []}
                skills={resume.skills || []}
                certifications={resume.certifications || []}
                refreshResumes={refreshResumes}
              />

              <div className="mt-4">
                <label
                  htmlFor={`job-description-${resume.id}`}
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Job Description
                </label>
                <textarea
                  id={`job-description-${resume.id}`}
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

              <button
                onClick={() => {
                  const html = convertResumeToHTML({
                    name: resume.name,
                    email: resume.email,
                    phone: resume.phone,
                    summary: resume.summary,
                    experience: resume.experience,
                    education: resume.education,
                    skills: resume.skills,
                    certifications: resume.certifications,
                  });

                  void handleScore(resume.id, html, jobDescriptions[resume.id] || "");
                }}
                disabled={loadingScore[resume.id]}
                className={`bg-yellow-600 hover:bg-yellow-800 text-black font-medium px-4 py-2 rounded mt-2 transition ${
                  loadingScore[resume.id] ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loadingScore[resume.id] ? "Scoring..." : "Score Resume"}
              </button>

              {loadingScore[resume.id] && (
                <div className="text-center mt-2 text-sm text-indigo-500 animate-pulse">
                  ⏳ Getting your score...
                </div>
              )}

              {atsScores[resume.id] && !loadingScore[resume.id] && (
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

export default ResumeList;
