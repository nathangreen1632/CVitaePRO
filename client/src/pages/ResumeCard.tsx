import React, { useState } from "react";
import { parseResumeMarkdown } from "../helpers/parseResumeMarkdown";


interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

interface Education {
  institution: string;
  degree: string;
  graduation_year: string;
}

interface Certification {
  name: string;
  year: string;
}

interface ResumeCardProps {
  id: string;
  name: string;
  resumeSnippet: string;
  summary: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
  refreshResumes: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({id, name, resumeSnippet, summary, email, phone, experience = [], education = [], skills = [], certifications = [], portfolio, linkedin, refreshResumes}) => {
  let parsedSummary = summary;

  try {
    if (resumeSnippet) {
      const parsed = parseResumeMarkdown(resumeSnippet, summary);
      parsedSummary = parsed.summary || summary;
    }
  } catch (e) {
    console.warn("⚠️ Failed to parse resume markdown:", e);
  }

  const cleanSummary: string = parsedSummary || "No summary provided.";


  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleEdit = () => {
    window.location.href = `/edit-resume/${id}`;
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    setIsDownloading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/resume/${id}/download?format=${format}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to download resume.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}-resume.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Something went wrong while downloading.");
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You're not logged in.");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to delete resume.");
        return;
      }

      const stored = localStorage.getItem("resumes");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.filter((resume: { id: string }) => resume.id !== id);
        localStorage.setItem("resumes", JSON.stringify(updated));
      }

      refreshResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You're not logged in.");
      setIsEnhancing(false);
      return;
    }

    const resumeData = {name, email, phone, linkedin, portfolio, summary, experience, education, skills, certifications};

    try {
      const response = await fetch("/api/openai/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to enhance resume:", errorData);
        setError("Failed to enhance resume.");
        return;
      }

      const data = await response.json();
      const enhancedResume = data.resume;

      const stored = localStorage.getItem("resumes");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((r: { id: string }) =>
          r.id === id ? { ...r, ...enhancedResume } : r
        );
        localStorage.setItem("resumes", JSON.stringify(updated));
      }

      refreshResumes();
    } catch (error) {
      console.error("❌ Error enhancing resume:", error);
      setError("Something went wrong while enhancing.");
    } finally {
      setIsEnhancing(false);
    }
  };

  function formatWorkDates(startDate: string, endDate: string): string {
    const cleanStart = startDate?.trim();
    const cleanEnd = endDate?.trim();

    const hasValidStart = !!cleanStart && cleanStart.toLowerCase() !== "null" && cleanStart.toLowerCase() !== "undefined";
    const hasValidEnd = !!cleanEnd && cleanEnd.toLowerCase() !== "null" && cleanEnd.toLowerCase() !== "undefined";

    if (hasValidStart && hasValidEnd) {
      return `${cleanStart} to ${cleanEnd}`;
    }

    if (hasValidStart && !hasValidEnd) {
      return `${cleanStart} to Present`;
    }

    return "N/A";
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          {email && (
            <p className="text-sm text-gray-300 break-all">
              <strong>Email: </strong>{email}
            </p>
          )}
          {phone && (
            <p className="text-sm text-gray-300 break-all">
              <strong>Phone: </strong>{phone}
            </p>
          )}

          {portfolio && (
            <p className="text-sm text-blue-300 break-all">
              <strong>Portfolio: </strong>
              <a
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-500"
              >
                {portfolio}
              </a>
            </p>
          )}

          {linkedin && (
            <p className="text-sm text-blue-300 break-all">
              <strong>LinkedIn: </strong>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-500"
              >
                {linkedin}
              </a>
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-2">
        <strong>Summary:</strong> {cleanSummary}
      </p>

      {resumeSnippet?.includes("{") || resumeSnippet?.includes("[") ? null : (
        <div
          className="text-sm text-gray-300 mb-4 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: parseResumeMarkdown(resumeSnippet, "") }}
        />
      )}

      <div className="mb-4">
        <h4 className="font-semibold text-lg py-3">Experience</h4>
        {experience.length > 0 ? (
          experience.map((exp) => (
            <div key={`${exp.company}-${exp.role}-${exp.start_date}`} className="text-sm mt-2 border-b border-gray-700 pb-2">
              <p className="font-medium text-gray-100">{exp.company} — {exp.role}</p>
              <p className="text-gray-400">{formatWorkDates(exp.start_date, exp.end_date)}</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                {exp.responsibilities.map((item, i) => (
                  <li key={`${item}-${i}`} className="text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No experience data available.</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-lg">Education</h4>
        {education.length > 0 ? (
          education.map((edu) => (
            <div key={`${edu.institution}-${edu.degree}-${edu.graduation_year}`} className="text-sm text-gray-300 mt-1">
              🎓 {edu.degree} from {edu.institution} ({edu.graduation_year})
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No education data available.</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-lg">Skills</h4>
        {skills.length > 0 ? (
          <div className="text-gray-300 text-sm space-y-1">
            {skills.map((skillLine: string) => {
              const parts: string[] = skillLine.split(":");
              if (parts.length === 2) {
                const label: string = parts[0].trim();
                const content: string = parts[1].trim();
                return (
                  <p key={skillLine}>
                    <strong>{label}:</strong> {content}
                  </p>
                );
              }
              return <p key={skillLine}>{skillLine}</p>;
            })}

          </div>
        ) : (
          <p className="text-gray-400 text-sm">No skills listed.</p>
        )}
      </div>


      <div className="mb-4">
        <h4 className="font-semibold text-lg">Certifications</h4>
        {certifications.length > 0 ? (
          certifications
            .filter((cert) => cert.name?.trim())
            .map((cert: Certification) => (
              <div
                key={`${cert.name}-${cert.year}`}
                className="text-sm text-gray-300 mt-1"
              >
                 {cert.name}
                {cert.year && cert.year.trim().length > 0 ? ` (${cert.year})` : ""}
              </div>

            ))

        ) : (
          <p className="text-gray-400 text-sm">No certifications listed.</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2 justify-between">
        <button onClick={handleEdit} className="bg-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indgio-800 transition">
          Edit
        </button>
        <button
          onClick={() => setShowDownloadModal(true)}
          className="bg-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
        >
          Download
        </button>

        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="bg-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-800 transition"
        >
          {isEnhancing ? "Enhancing..." : "Enhance"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-2xl w-[320px] border border-gray-600">
            <h3 className="text-xl font-semibold mb-5 text-center">Select Download Format</h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownload("pdf")}
                disabled={isDownloading}
                className={`${
                  isDownloading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"
                } bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition`}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>

              <button
                onClick={() => handleDownload("docx")}
                disabled={isDownloading}
                className={`${
                  isDownloading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-900"
                } bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition`}
              >
                {isDownloading ? "Downloading..." : "Download DOCX"}
              </button>

              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-sm text-gray-400 hover:text-white mt-4 text-center transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeCard;