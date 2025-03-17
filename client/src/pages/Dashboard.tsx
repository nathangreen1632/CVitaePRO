import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import ResumeList from "../components/ResumeList.jsx";
import ResumeActionsPanel from "../components/ResumeActionsPanel.jsx";
import RecentActivityLog from "../components/RecentActivityLog.jsx";
import { useDashboardState } from "../hooks/useDashboardState.js";
import { handleEnhanceResume, handleScoreResume } from "../helpers/resumeHandlers";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      console.warn("🔒 No valid token found. Redirecting to login...");
      navigate("/login");
    }
  }, []);

  const buildActivityLogFromResumes = (resumeList: typeof resumes): string[] => {
    return resumeList.map((resume) => {
      const type = resume.resumeSnippet?.length > 0 ? "Edited" : "Generated";
      return `${type} Resume - ${resume.name}`;
    });
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
        const mappedExperience = (resume.experience || []).map((exp: any) => {
          let cleanEndDate = "";
          if (typeof exp.end_date === "string") {
            cleanEndDate = exp.end_date.trim();
          }

          return {
            company: exp.company || '',
            role: exp.role || '',
            start_date: typeof exp.start_date === 'string' ? exp.start_date.trim() : '',
            end_date: cleanEndDate,
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          };
        });

        return {
          id: resume.id || "",
          name: resume.name || resume.title || "Untitled Resume",
          resumeSnippet: resume.resumeSnippet || resume.content || "",
          summary: resume.summary || resume.extracted_text || "",
          email: resume.email || "",
          phone: resume.phone || "",
          linkedin: resume.linkedin || "",
          portfolio: resume.portfolio || "",
          experience: mappedExperience,
          education: (resume.education || []).map((edu: any) => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            graduation_year: edu.graduation_year || '',
          })),
          skills: Array.isArray(resume.skills) ? resume.skills : [],
          certifications: (resume.certifications || []).map((cert: any) => ({
            name: cert.name || '',
            year: cert.year || '',
          })),
        };
      });

      localStorage.setItem("resumes", JSON.stringify(formattedResumes));
      setResumes(formattedResumes);

      // if (formattedResumes.length > resumes.length) {
      //   const last = formattedResumes[formattedResumes.length - 1];
      //   const scrollId = `resume-${last.id}-${last.name.replace(/\s+/g, "-")}`;
      //   setTimeout(() => {
      //     const el = document.getElementById(scrollId);
      //     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      //   }, 200);
      // }

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Semantic landmark: Header */}
      <header>
        <HeaderBar title="Dashboard" />
        <h1 className="sr-only" aria-label="Dashboard Page">
          Dashboard
        </h1>
      </header>

      {/* Semantic landmark: Main */}
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
            await fetchResumes(); // ✅ Call refresh here manually after enhancement
          }}
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
            refreshResumes={refreshResumes} // ✅ FIXED: now using your custom function
            handleScoreResume={handleScoreResume}
          />

        )}
      </main>
    </div>

  );
};

export default Dashboard;
