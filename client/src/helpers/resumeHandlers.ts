import { buildOpenAIPayload } from "./buildOpenAIPayload";
import { parseResumeMarkdown } from "./parseResumeMarkdown";
import React from "react";

const cleanText = (input: string): string =>
  input
    .replace(/```[^]*?```/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\[([^\]\r\n]{1,200})]\([^()\r\n]{1,300}\)/g, "$1")
    .replace(/^- /gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

export const convertResumeToHTML = (resume: {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
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
}): string => {
  const splitSkills = resume.skills.flatMap((group) => {
    if (group.includes(":")) {
      const [, list] = group.split(":");
      return list.split(",").map((s) => s.trim());
    }
    return [group.trim()];
  });

  const formatDateRange = (start: string, end: string): string => {
    const cleanStart = cleanText(start).replace(/\s+/g, " ").trim();
    const cleanEnd = cleanText(end).replace(/\s+/g, " ").trim();
    return cleanEnd && cleanEnd !== " to Present"
      ? `${cleanStart} – ${cleanEnd}`
      : `${cleanStart} – to Present`;
  };

  const rawSummary = resume.summary || "";
  const cleanedSummary = cleanText(rawSummary);
  const summaryText =
    cleanedSummary.length > 0 ? cleanedSummary : "No summary provided.";

  return `
    <section>
      <h2>Contact Information</h2>
      <p><strong>Name:</strong> ${cleanText(resume.name)}</p>
      <p><strong>Email:</strong> ${cleanText(resume.email)}</p>
      <p><strong>Phone:</strong> ${cleanText(resume.phone)}</p>
      <p><strong>LinkedIn:</strong> ${cleanText(resume.linkedin)}</p>
      <p><strong>Portfolio:</strong> ${cleanText(resume.portfolio)}</p>

      <h2>Professional Summary</h2>
      <p>${summaryText}</p>

      <h2>Experience</h2>
      <ul>
        ${resume.experience
    .map(
      (exp) => `
              <li>
                <strong>${cleanText(exp.role)}</strong> at ${cleanText(
        exp.company
      )}<br />
                ${formatDateRange(exp.start_date, exp.end_date)}
                <ul>
                  ${exp.responsibilities
        .map((r) => `<li>${cleanText(r)}</li>`)
        .join("")}
                </ul>
              </li>
            `
    )
    .join("")}
      </ul>

      <h2>Education</h2>
      <ul>
        ${resume.education
    .map(
      (edu) => `
              <li>
                ${cleanText(edu.degree)}, ${cleanText(
        edu.institution
      )} (${cleanText(edu.graduation_year)})
              </li>
            `
    )
    .join("")}
      </ul>

      <h2>Skills</h2>
      <ul>
        ${splitSkills.map((skill) => `<li>${cleanText(skill)}</li>`).join("")}
      </ul>

      <h2>Certifications</h2>
      <ul>
        ${resume.certifications
    .map(
      (cert) =>
        `<li>${cleanText(cert.name)} (${cleanText(cert.year)})</li>`
    )
    .join("")}
      </ul>
    </section>
  `;
};

export const handleGenerateResume = async ({
                                             resumeData,
                                             setLoading,
                                             setError,
                                             setActivityLog,
                                             fetchResumes,
                                           }: {
  resumeData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setActivityLog: React.Dispatch<React.SetStateAction<string[]>>;
  fetchResumes: () => Promise<void>;
}) => {
  setLoading(true);
  setError(null);

  const formattedResumeData = {
    type: "resume",
    jobDescription: resumeData.jobDescription ?? "",
    resumeData: {
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      linkedin: resumeData.linkedin,
      portfolio: resumeData.portfolio,
      summary: resumeData.summary,
      experience: resumeData.experience.map((exp: any) => ({
        company: exp.company,
        role: exp.role,
        start_date: exp.start_date,
        end_date: exp.end_date,
        responsibilities: Array.isArray(exp.responsibilities)
          ? exp.responsibilities
          : [],
      })),
      education: resumeData.education.map((edu: any) => ({
        institution: edu.institution,
        degree: edu.degree,
        graduation_year: edu.graduation_year,
      })),
      skills: resumeData.skills.filter((s: string) => s.trim().length > 0),
      certifications: resumeData.certifications.map((cert: any) => ({
        name: cert.name,
        year: cert.year,
      })),
    },
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/resume/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedResumeData),
    });

    if (!response.ok) {
      setError("Failed to generate resume.");
      return;
    }

    const activityItem = `Generated Resume - ${
      resumeData.name ?? "Untitled Resume"
    }`;
    const updatedLog = [
      activityItem,
      ...(JSON.parse(localStorage.getItem("activityLog") ?? "[]")),
    ];
    localStorage.setItem("activityLog", JSON.stringify(updatedLog));
    setActivityLog(updatedLog);

    await fetchResumes();
  } catch (error) {
    console.error("Error generating resume:", error);
    setError("Something went wrong while generating the resume.");
  } finally {
    setLoading(false);
  }
};

export const handleEnhanceResume = async ({
                                            resumeData,
                                            setLoading,
                                            setError,
                                            setActivityLog,
                                          }: {
  resumeData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setActivityLog: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");

    const resumeText = buildOpenAIPayload(resumeData);

    const response = await fetch("/api/openai/enhance-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resumeText }),
    });

    const data = await response.json();

    if (!response.ok || !data.resume) {
      setError(data.error ?? "Failed to enhance resume.");
      return;
    }

    const enhancedResume = parseResumeMarkdown(data.resume, resumeData);

    const activityItem = `Enhanced Resume - ${
      enhancedResume.name ?? "Untitled Resume"
    }`;
    const updatedLog = [
      activityItem,
      ...(JSON.parse(localStorage.getItem("activityLog") ?? "[]")),
    ];
    localStorage.setItem("activityLog", JSON.stringify(updatedLog));
    setActivityLog(updatedLog);
  } catch (error) {
    console.error("Error enhancing resume:", error);
    setError("Something went wrong while enhancing the resume.");
  } finally {
    setLoading(false);
  }
};

interface ScoreResumeParams {
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
}

export const handleScoreResume = async ({
                                          resumeId,
                                          htmlResume,
                                          jobDescription,
                                          setAtsScores,
                                        }: ScoreResumeParams): Promise<void> => {
  if (!jobDescription || jobDescription.trim().length < 20) {
    alert(
      "⚠️ Please enter a valid job description with at least 20 characters."
    );
    return;
  }

  try {
    const fullResume = JSON.parse(localStorage.getItem("resumes") ?? "[]").find(
      (r: any) => r.id === resumeId
    );

    if (!fullResume) {
      alert("⚠️ Could not find resume data for scoring.");
      return;
    }

    const response = await fetch("/api/ats/score-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlResume,
        jobDescription,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setAtsScores((prev) => ({
      ...prev,
      [resumeId]: {
        atsScore: data.atsScore ?? 0,
        keywordMatch: data.keywordMatch ?? 0,
        softSkillsMatch: data.softSkillsMatch ?? 0,
        industryTermsMatch: data.industryTermsMatch ?? 0,
        formattingErrors: data.formattingErrors ?? [],
      },
    }));
  } catch (error) {
    console.error("❌ Error scoring resume:", error);
  }
};
