import React, { useState } from "react";

type Experience = {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
};

type Education = {
  institution: string;
  degree: string;
  graduation_year: string;
};

type Certification = {
  name: string;
  year: string;
};

type Resume = {
  summary: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  resumeSnippet: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
};

type AtsScores = Record<
  string,
  {
    atsScore: number;
    keywordMatch: number;
    softSkillsMatch: number;
    industryTermsMatch: number;
    formattingErrors: string[];
  }
>;

export const useDashboardState = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [atsScores, setAtsScores] = useState<AtsScores>({});
  const [jobDescriptions, setJobDescriptions] = useState<Record<string, string>>({});

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    resumes,
    setResumes,
    activityLog,
    setActivityLog,
    loading,
    setLoading,
    error,
    setError,
    atsScores,
    setAtsScores,
    jobDescriptions,
    setJobDescriptions,
    resumeData,
    setResumeData,
    handleChange,
  };
};
