import React, { useState } from "react";

interface ResumeCardProps {
  id: string;
  name: string;
  jobTitle: string;
  resumeSnippet: string;
  refreshResumes: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ id, name, jobTitle, resumeSnippet, refreshResumes }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Edit Resume (Redirect to edit page)
  const handleEdit = () => {
    window.location.href = `/edit-resume/${id}`;
  };

  // 🟢 Download Resume
  const handleDownload = async () => {
    setLoading(true);
    setError(null); // ✅ Clear previous errors
    try {
      const response = await fetch(`http://localhost:3000/api/resumes/${id}/download`);
      if (!response.ok) {
        setError("Failed to download resume.");
        return;
      }

      // Convert response to blob (file data)
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
    setLoading(false);
  };

  // 🟢 Delete Resume
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/resumes/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setError("Failed to delete resume.");
        return;
      }

      refreshResumes(); // ✅ Refresh list after deletion
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError("Something went wrong while deleting.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
      {/* Profile Section */}
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-gray-400">{jobTitle}</p>
        </div>
      </div>

      {/* Resume Preview Snippet */}
      <p className="text-gray-300 text-sm line-clamp-3">{resumeSnippet}</p>

      {/* Error Display */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button onClick={handleEdit} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Edit
        </button>
        <button onClick={handleDownload} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition" disabled={loading}>
          {loading ? "Downloading..." : "Download"}
        </button>
        <button onClick={handleDelete} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition" disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
