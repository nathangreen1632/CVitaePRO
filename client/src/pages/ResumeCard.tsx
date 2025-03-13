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
  jobTitle: string;
  resumeSnippet: string;
  summary: string;
  email: string;          // ✅ Add this
  phone: string;          // ✅ Add this
  linkedin: string;       // ✅ Add this
  portfolio: string;      // ✅ Add this
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
  refreshResumes: () => void;
}


const ResumeCard: React.FC<ResumeCardProps> = ({
                                                 id,
                                                 name,
                                                 jobTitle,
                                                 resumeSnippet,
                                                 summary,
                                                 email,        // ✅ Add this
                                                 phone,        // ✅ Add this
                                                 experience = [],
                                                 education = [],
                                                 skills = [],
                                                 certifications = [],
                                                 portfolio,
                                                 linkedin,
                                                 refreshResumes,
                                               }) => {
  const parsed = parseResumeMarkdown(resumeSnippet, summary);

  const cleanSummary = parsed.summary || summary;


  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    window.location.href = `/edit-resume/${id}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/resume/${id}/download`, {
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
      link.setAttribute("download", `${name}-resume.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Something went wrong while downloading.");
    }

    setIsDownloading(false);
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

    try {
      const response = await fetch("/api/openai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: id, resumeText: resumeSnippet }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to enhance resume:", errorData);
        setError("Failed to enhance resume.");
        return;
      }

      refreshResumes();
    } catch (error) {
      console.error("❌ Error enhancing resume:", error);
      setError("Something went wrong while enhancing.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-gray-400">{jobTitle}</p>
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
      <p
        className="text-sm text-gray-300 mb-4"
        dangerouslySetInnerHTML={{ __html: parseResumeMarkdown(resumeSnippet, []) }}
      ></p>


      <div className="mb-4">
        <h4 className="font-semibold text-lg">Experience</h4>
        {experience.length > 0 ? (
          experience.map((exp, idx) => (
            <div key={idx} className="text-sm mt-2 border-b border-gray-700 pb-2">
              <p className="font-medium">
                {exp.company} — {exp.role}
              </p>
              <p className="text-gray-400">
                {exp.start_date} to {exp.end_date || "Present"}
              </p>
              <ul className="list-disc list-inside ml-2 mt-1">
                {exp.responsibilities.map((item, i) => (
                  <li key={i} className="text-gray-300">
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
          education.map((edu, idx) => (
            <div key={idx} className="text-sm text-gray-300 mt-1">
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
          <p className="text-gray-300 text-sm">{skills.join(", ")}</p>
        ) : (
          <p className="text-gray-400 text-sm">No skills listed.</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-lg">Certifications</h4>
        {certifications.length > 0 ? (
          certifications.map((cert, idx) => (
            <div key={idx} className="text-sm text-gray-300 mt-1">
              ✅ {cert.name} ({cert.year})
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No certifications listed.</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2 justify-between">
        <button onClick={handleEdit} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Edit
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {isEnhancing ? "Enhancing..." : "Enhance"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;