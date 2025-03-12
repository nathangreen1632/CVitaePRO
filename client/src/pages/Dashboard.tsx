import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResumeCard from "../pages/ResumeCard.jsx";
import HeaderBar from "../components/HeaderBar.jsx"; // ✅ Added shared HeaderBar
import ATSScoreBreakdown from "../components/ATSScoreBreakdown.jsx"; // ✅ NEW
import { parseResumeMarkdown } from "../helpers/parseResumeMarkdown"; // ✅ NEW
import { buildOpenAIPayload } from "../helpers/buildOpenAIPayload"; // ✅ Make sure this is at the top
import ResumeDetailsForm from "../components/ResumeDetailsForm.jsx"; // ✅ NEW



const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<{
    summary: string;
    id: string;
    name: string;
    email: string;
    phone: string;
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
  }[]>([]);




  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [atsScores, setAtsScores] = useState<Record<string, {
    atsScore: number;
    keywordMatch: number;
    softSkillsMatch: number;
    industryTermsMatch: number;
    formattingErrors: string[];
  }>>({}); // ✅ NEW
  const [jobDescriptions, setJobDescriptions] = useState<Record<string, string>>({}); // ✅ NEW


  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    experience: [
      {
        company: "",
        role: "",
        start_date: "",
        end_date: "",
        responsibilities: [""],
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        graduation_year: "",
      },
    ],
    skills: [],
    certifications: [
      {
        name: "",
        year: "",
      },
    ],
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("❌ Invalid token format:", error);
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      console.warn("🔒 No valid token found. Redirecting to login...");
      navigate("/login");
    }
  }, []);

  const fetchResumes = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      console.error("❌ Token expired. Please log in again.");
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/resume/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to load resumes. Please try again later.");
        return;
      }

      const data = await response.json();

      const formattedResumes = data.resumes.map((resume: any) => ({
        id: resume.id,
        name: resume.title,
        jobTitle: "N/A",
        resumeSnippet: resume.content || "",
        summary: resume.extracted_text || "",
        experience: resume.experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
        certifications: resume.certifications || [],
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
      }));

      localStorage.setItem("resumes", JSON.stringify(formattedResumes));
      setResumes(formattedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
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
      const updatedLog = [activityItem, ...activityLog];
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



  const handleEnhanceResume = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const resumeText = buildOpenAIPayload(resumeData); // ✅ Use formatter

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
      const updatedLog = [activityItem, ...activityLog];
      localStorage.setItem("activityLog", JSON.stringify(updatedLog));
      setActivityLog(updatedLog);

      await fetchResumes(); // ✅ Refresh after enhancement
    } catch (error) {
      console.error("❌ Error enhancing resume:", error);
      setError("Something went wrong while enhancing the resume.");
    } finally {
      setLoading(false);
    }
  };



  const handleScoreResume = async (resumeId: string, resumeSnippet: string) => {
    const jobDescription = jobDescriptions[resumeId]?.trim();

    // Step 1: Parse the resumeSnippet into structured fields
    const parsedResume = parseResumeMarkdown(resumeSnippet, {});

    // Step 2: Convert to HTML for scoring
    const resumeHtml = convertResumeToHTML({
      id: resumeId,
      summary: parsedResume.summary || "",
      name: parsedResume.name || "",
      email: parsedResume.email || "",
      phone: parsedResume.phone || "",
      jobTitle: parsedResume.jobTitle || "",
      resumeSnippet: parsedResume.resumeSnippet || "",
      experience: parsedResume.experience || [],
      education: parsedResume.education || [],
      skills: parsedResume.skills || [],
      certifications: parsedResume.certifications || [],
    });

    console.log("DEBUG scoring:", { resumeId, resumeHtml, jobDescription });

    if (!resumeHtml || resumeHtml.length < 50) {
      alert("❌ Resume content is missing or too short to score.");
      return;
    }

    if (!jobDescription) {
      alert("Please enter a job description to compare with the resume.");
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




  useEffect(() => {
    const loadResumes = async () => {
      const storedResumes = localStorage.getItem("resumes");
      const storedActivity = localStorage.getItem("activityLog");

      if (storedActivity) {
        setActivityLog(JSON.parse(storedActivity));
      }

      if (storedResumes) {
        setResumes(JSON.parse(storedResumes));
      } else {
        await fetchResumes();
      }
    };

    loadResumes().catch((error) => console.error("❌ Error loading resumes:", error));
  }, []);

  const convertResumeToHTML = (resume: typeof resumes[number]): string => {
    return `
    <section>
      <h1>${resume.name || "Untitled Resume"}</h1>
      <p><strong>Email:</strong> ${resume.email || "No email provided"}</p>
      <p><strong>Phone:</strong> ${resume.phone || "No phone provided"}</p>

      <h2>${resume.jobTitle || ""}</h2>
      <p>${resume.summary || ""}</p>

      <h3>Experience</h3>
      <ul>
        ${(resume.experience || []).map(
      (exp) => `
            <li>
              <strong>${exp.role || ""}</strong> at ${exp.company || ""}<br />
              ${exp.start_date || ""} – ${exp.end_date || "Present"}<br />
              <ul>
                ${(exp.responsibilities || []).map((r) => `<li>${r}</li>`).join("")}
              </ul>
            </li>`
    ).join("")}
      </ul>

      <h3>Education</h3>
      <ul>
        ${(resume.education || []).map(
      (edu) => `
            <li>
              ${edu.degree || ""} from ${edu.institution || ""}, ${edu.graduation_year || ""}
            </li>`
    ).join("")}
      </ul>

      <h3>Skills</h3>
      <p>${(resume.skills || []).join(", ")}</p>

      <h3>Certifications</h3>
      <ul>
        ${(resume.certifications || []).map(
      (cert) => `<li>${cert.name || ""} (${cert.year || ""})</li>`
    ).join("")}
      </ul>
    </section>
  `.trim();
  };





  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderBar title="Dashboard" /> {/* ✅ Persistent HeaderBar */}

      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button className="p-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600">Upload Resume</button>
          <button onClick={handleGenerateResume} className="p-4 bg-purple-500 text-white text-center rounded hover:bg-purple-600">
            Generate Resume
          </button>
          <button onClick={handleEnhanceResume} className="p-4 bg-green-500 text-white text-center rounded hover:bg-green-600">
            Enhance Resume
          </button>
          <Link
            to="/generate-cover-letter"
            className="p-4 bg-indigo-500 text-white text-center rounded hover:bg-indigo-600"
          >
            Generate Cover Letter
          </Link>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <ul>
            {activityLog.length > 0 ? (
              activityLog.map((item, index) => (
                <li key={index} className="py-2 border-b">
                  <Link to="#" className="hover:underline">
                    {item.includes("Generated") ? (
                      <>
                        Generated Resume - <span className="text-green-500">{item.split(" - ")[1]}</span>
                      </>
                    ) : (
                      <>
                        Edited Resume - <span className="text-blue-500">{item.split(" - ")[1]}</span>
                      </>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-2 text-gray-400">No recent activity yet.</li>
            )}
          </ul>
        </div>

        {/* ✅ Resume Details Form */}
        <ResumeDetailsForm
          resumeData={resumeData}
          setResumeData={setResumeData}
          handleChange={handleChange}
          handleGenerateResume={handleGenerateResume}
        />



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

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleScoreResume(resume.id, resume.resumeSnippet)}




                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Score Resume
                    </button>
                  </div>

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
      </main>
    </div>
  );
};

export default Dashboard;


