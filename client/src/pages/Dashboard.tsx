import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import ResumeList from "../components/ResumeList.jsx";
import ResumeActionsPanel from "../components/ResumeActionsPanel.jsx";
import RecentActivityLog from "../components/RecentActivityLog.jsx";
import { useDashboardState } from "../hooks/useDashboardState.js";
import {
  handleEnhanceResume,
  handleScoreResume,
} from "../helpers/resumeHandlers";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { resumes, setResumes, activityLog, setActivityLog, loading, setLoading, error, setError, atsScores, setAtsScores, jobDescriptions, setJobDescriptions,
    resumeData } = useDashboardState();

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
        name: resume.name || resume.title || "Untitled Resume",
        jobTitle: resume.jobTitle || "N/A",
        resumeSnippet: resume.resumeSnippet || resume.content || "",
        summary: resume.summary || resume.extracted_text || "",
        email: resume.email || "",
        phone: resume.phone || "",
        linkedin: resume.linkedin || "",
        portfolio: resume.portfolio || "",
        experience: resume.experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
        certifications: resume.certifications || [],
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

  const refreshResumes = (deletedId?: string) => {
    if (deletedId) {
      setResumes((prev) => {
        const updated = prev.filter((r) => r.id !== deletedId);
        localStorage.setItem("resumes", JSON.stringify(updated));
        return updated;
      });
    } else {
      void fetchResumes(); // ✅ Prevents TS/IDE warnings about unhandled Promise
    }
  };


  useEffect(() => {
    const loadResumes = async () => {
      const storedActivity = localStorage.getItem("activityLog");

      if (storedActivity) {
        setActivityLog(JSON.parse(storedActivity));
      }

      await fetchResumes();
    };

    loadResumes().catch((error) =>
      console.error("❌ Error loading resumes:", error)
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderBar title="Dashboard" />

      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>

        <RecentActivityLog activityLog={activityLog} />

        <ResumeActionsPanel
          onEnhance={() =>
            handleEnhanceResume({
              resumeData,
              setLoading,
              setError,
              setActivityLog,
              fetchResumes,
            })
          }
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}


        {loading ? (
          <p className="text-center text-gray-400">Loading resumes...</p>
        ) : (
          <ResumeList
            resumes={resumes}
            jobDescriptions={jobDescriptions}
            setJobDescriptions={setJobDescriptions}
            handleScoreResume={(resumeId, resumeSnippet) =>
              handleScoreResume({
                resumeId,
                resumeSnippet,
                jobDescription: jobDescriptions[resumeId] || "",
                setAtsScores,
              })
            }
            atsScores={atsScores}
            refreshResumes={refreshResumes}
          />

        )}
      </main>
    </div>
  );
};

export default Dashboard;
