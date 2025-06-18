import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import HeaderBar from "../components/layout/HeaderBar.tsx";
import ResumeList from "../components/resume/display/ResumeList.tsx";
import ResumeActionsPanel from "../components/resume/display/ResumeActionsPanel.tsx";
import RecentActivityLog from "../components/resume/display/RecentActivityLog.tsx";
import { useDashboardState } from "../hooks/useDashboardState.js";
import { handleEnhanceResume, handleScoreResume } from "../helpers/resumeHandlers.js";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tokenHydrated, setTokenHydrated] = useState(false);

  const {
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
  } = useDashboardState();

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
    if (token === null) {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
      }
    }
    setTokenHydrated(true);
  }, [token, navigate]);


  const buildActivityLogFromResumes = (resumeList: typeof resumes): string[] => {
    return resumeList.map((resume) => {
      const type = resume.resumeSnippet?.length > 0 ? "Edited" : "Generated";
      return `${type} Resume - ${resume.name} [${resume.id}]`;
    });
  };


  const fetchResumes = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
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

      const formattedResumes = data.resumes.map((resume: any) => {
        const mappedExperience = (resume.experience ?? []).map((exp: any) => {
          let cleanEndDate = "";
          if (typeof exp.end_date === "string") {
            cleanEndDate = exp.end_date.trim();
          }

          return {
            company: exp.company ?? '',
            role: exp.role ?? '',
            start_date: typeof exp.start_date === 'string' ? exp.start_date.trim() : '',
            end_date: cleanEndDate,
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          };
        });

        return {
          id: resume.id ?? "",
          name: resume.name ?? resume.title ?? "Untitled Resume",
          resumeSnippet: resume.resumeSnippet ?? resume.content ?? "",
          summary: resume.summary ?? resume.extracted_text ?? "",
          email: resume.email ?? "",
          phone: resume.phone ?? "",
          linkedin: resume.linkedin ?? "",
          portfolio: resume.portfolio ?? "",
          experience: mappedExperience,
          education: (resume.education ?? []).map((edu: any) => ({
            institution: edu.institution ?? '',
            degree: edu.degree ?? '',
            graduation_year: edu.graduation_year ?? '',
          })),
          skills: Array.isArray(resume.skills) ? resume.skills : [],
          certifications: (resume.certifications ?? []).map((cert: any) => ({
            name: cert.name ?? '',
            year: cert.year ?? '',
          })),
        };
      });

      localStorage.setItem("resumes", JSON.stringify(formattedResumes));
      setResumes(formattedResumes);

      const log = buildActivityLogFromResumes(formattedResumes);
      localStorage.setItem("activityLog", JSON.stringify(log));
      setActivityLog(log);
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
        const updatedLog = buildActivityLogFromResumes(updated);
        localStorage.setItem("activityLog", JSON.stringify(updatedLog));
        setActivityLog(updatedLog);
        return updated;
      });
    } else {
      void fetchResumes();
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

  if (!tokenHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600 dark:border-gray-300" />
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header>
        <HeaderBar title="Dashboard" />
        <h1 className="sr-only" aria-label="Dashboard Page">
          Dashboard
        </h1>
      </header>

      <main className="flex-grow container mx-auto p-6" role="main">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>

        <RecentActivityLog activityLog={activityLog} />

        <ResumeActionsPanel
          onEnhance={async () => {
            await handleEnhanceResume({
              resumeData,
              setLoading,
              setError,
              setActivityLog,
            });
            await fetchResumes();
          }} onGenerate={() => navigate("/resume-form")}
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400">Loading resumes...</p>
        ) : (
          <ResumeList
            resumes={resumes}
            jobDescriptions={jobDescriptions}
            setJobDescriptions={setJobDescriptions}
            atsScores={atsScores}
            setAtsScores={setAtsScores}
            refreshResumes={refreshResumes}
            handleScoreResume={handleScoreResume}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
