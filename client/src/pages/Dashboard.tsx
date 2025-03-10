import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ResumeCard from "../pages/ResumeCard.jsx";
import HeaderBar from "../components/HeaderBar.jsx"; // ✅ Added shared HeaderBar

const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<{
    summary: string;
    id: string;
    name: string;
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

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
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
      const response = await fetch("http://localhost:3000/api/resume/list", {
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
        summary: resumeData.summary,
        experience: resumeData.experience.split("\n").map((exp) => ({
          company: exp.trim(),
          role: "Software Engineer",
          start_date: "2023-01-01",
          end_date: "",
          responsibilities: ["Worked on multiple projects"],
        })),
        education: [
          {
            institution: resumeData.education,
            degree: "Bachelor's Degree",
            graduation_year: "2025",
          },
        ],
        skills: resumeData.skills.split(",").map((skill) => skill.trim()),
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

    if (resumes.length === 0) {
      setError("No resumes found to enhance.");
      return;
    }

    const latestResume = resumes[0];

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(latestResume.id);
    if (!isUUID) {
      setError("Invalid resume ID. Cannot enhance resume.");
      return;
    }

    try {
      const response = await fetch("/api/openai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: latestResume.id,
          resumeText: latestResume.resumeSnippet,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to enhance resume:", errorData);
        setError("Failed to enhance resume.");
        return;
      }

      await fetchResumes();
    } catch (error) {
      console.error("❌ Error enhancing resume:", error);
      setError("Something went wrong while enhancing the resume.");
    } finally {
      setLoading(false);
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
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">Resume Details</h2>
          {/* ALL FIELDS EXACTLY AS YOU WROTE THEM */}
          <label className="block mb-3">
            <span className="text-gray-300">Full Name</span>
            <input type="text" name="name" value={resumeData.name} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="John Doe" />
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Email</span>
            <input type="text" name="email" value={resumeData.email} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="example@example.com" />
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Phone Number</span>
            <input type="text" name="phone" value={resumeData.phone} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="555-555-5555" />
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Professional Summary</span>
            <textarea name="summary" value={resumeData.summary} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="Write a brief summary..."></textarea>
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Work Experience</span>
            <textarea name="experience" value={resumeData.experience} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="List your work experience..."></textarea>
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Education</span>
            <textarea name="education" value={resumeData.education} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="List your educational background..."></textarea>
          </label>
          <label className="block mb-3">
            <span className="text-gray-300">Skills</span>
            <input type="text" name="skills" value={resumeData.skills} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="E.g. JavaScript, React, Node.js" />
          </label>
          <div className="flex justify-center mt-6 ">
            <button onClick={handleGenerateResume} className="bg-green-500 text-white px-6 py-3 rounded-lg">
              Generate Resume
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Resumes</h3>
          {loading ? (
            <p className="text-center text-gray-400">Loading resumes...</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
