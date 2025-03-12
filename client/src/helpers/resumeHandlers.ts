import { buildOpenAIPayload } from "./buildOpenAIPayload"; // ✅ adjust if path is different
import { parseResumeMarkdown } from "./parseResumeMarkdown";
import React from "react"; // ✅ Adjust path if needed

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
    resumeData: {
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      linkedin: resumeData.linkedin,
      portfolio: resumeData.portfolio,
      summary: resumeData.summary,
      experience: [
        {
          company: resumeData.experience[0].company,
          role: resumeData.experience[0].role,
          start_date: resumeData.experience[0].start_date,
          end_date: resumeData.experience[0].end_date,
          responsibilities: resumeData.experience[0].responsibilities,
        },
      ],
      education: [
        {
          institution: resumeData.education[0].institution,
          degree: resumeData.education[0].degree,
          graduation_year: resumeData.education[0].graduation_year,
        },
      ],
      skills: resumeData.skills.filter((s: string) => s.trim().length > 0),
      certifications: [
        {
          name: resumeData.certifications || "Placeholder for future certifications.",
          year: "",
        },
      ],
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

    const activityItem = `Generated Resume - ${resumeData.name || "Untitled Resume"}`;
    const updatedLog = [activityItem, ...(JSON.parse(localStorage.getItem("activityLog") ?? "[]"))];
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

  try {
    const token = localStorage.getItem("token");

    const resumeText = buildOpenAIPayload(resumeData); // ✅ standardized formatter

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
      setError(data.error || "Failed to enhance resume.");
      return;
    }

    const enhancedResume = data.resume;

    const activityItem = `Enhanced Resume - ${enhancedResume.name || "Untitled Resume"}`;
    const updatedLog = [activityItem, ...(JSON.parse(localStorage.getItem("activityLog") ?? "[]"))];
    localStorage.setItem("activityLog", JSON.stringify(updatedLog));
    setActivityLog(updatedLog);

    await fetchResumes(); // ✅ refresh resume list
  } catch (error) {
    console.error("❌ Error enhancing resume:", error);
    setError("Something went wrong while enhancing the resume.");
  } finally {
    setLoading(false);
  }
};

export const handleScoreResume = async ({
                                          resumeId,
                                          resumeSnippet,
                                          jobDescription,
                                          setAtsScores,
                                        }: {
  resumeId: string;
  resumeSnippet: string;
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
}) => {
  if (!jobDescription || jobDescription.trim().length < 20) {
    alert("Please enter a valid job description to compare with the resume.");
    return;
  }

  const parsedResume = parseResumeMarkdown(resumeSnippet, {});

  const resumeHtml = `
    <section>
      <h1>${parsedResume.name || "Untitled Resume"}</h1>
      <p><strong>Email:</strong> ${parsedResume.email || "No email provided"}</p>
      <p><strong>Phone:</strong> ${parsedResume.phone || "No phone provided"}</p>
      <h2>${parsedResume.jobTitle || ""}</h2>
      <p>${parsedResume.summary || ""}</p>

      <h3>Experience</h3>
      <ul>
        ${(parsedResume.experience || [])
    .map(
      (exp: { role?: string; company?: string; start_date?: string; end_date?: string; responsibilities?: string[] }) => `
          <li>
            <strong>${exp.role ?? ""}</strong> at ${exp.company ?? ""}<br />
            ${exp.start_date ?? ""} – ${exp.end_date ?? "Present"}<br />
            <ul>
              ${(exp.responsibilities || []).map((r) => `<li>${r}</li>`).join("")}
            </ul>
          </li>`
    )
    .join("")}
      </ul>

      <h3>Education</h3>
      <ul>
        ${(parsedResume.education || [])
    .map(
      (edu: { degree?: string; institution?: string; graduation_year?: string }) => `
        <li>
          ${edu.degree ?? ""} from ${edu.institution ?? ""}, ${edu.graduation_year ?? ""}
        </li>`
    )
    .join("")}
      </ul>

      <h3>Skills</h3>
      <p>${(parsedResume.skills || []).join(", ")}</p>

      <h3>Certifications</h3>
      <ul>
        ${(parsedResume.certifications || [])
    .map((cert: { name?: string; year?: string }) => `<li>${cert.name ?? ""} (${cert.year ?? ""})</li>`)
    .join("")}
      </ul>
    </section>
  `.trim();

  if (!resumeHtml || resumeHtml.length < 50) {
    alert("❌ Resume content is missing or too short to score.");
    return;
  }

  try {
    const response = await fetch("/api/ats/score-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ htmlResume: resumeHtml, jobDescription }),
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch ATS score");
      return;
    }

    const data = await response.json();

    setAtsScores((prev) => ({
      ...prev,
      [resumeId]: {
        atsScore: data.atsScore,
        keywordMatch: data.keywordMatch,
        softSkillsMatch: data.softSkillsMatch,
        industryTermsMatch: data.industryTermsMatch,
        formattingErrors: data.formattingErrors || [],
      },
    }));
  } catch (error) {
    console.error("❌ Error scoring resume:", error);
  }
};
