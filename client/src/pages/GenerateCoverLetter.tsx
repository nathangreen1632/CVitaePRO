import React, { useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";

const GenerateCoverLetter: React.FC = () => {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    name: "",
    email: "",
    phone: "",
    summary: "",
    tone: "Professional",
    length: "Concise",
    focusAreas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setCoverLetter("");

    const payload = {
      userInput: {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        hiringManagerName: "N/A",
        companyAddress: "N/A",
        jobDescription: "N/A",
      },
      applicantDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        yourAddress: "N/A",
        linkedin: "N/A",
        portfolio: "N/A",
      },
      resumeSummary: {
        summary: formData.summary,
        experience: [],
        education: [],
        skills: [],
        certifications: [],
      },
      customizationPreferences: {
        tone: formData.tone,
        length: formData.length,
        focusAreas: formData.focusAreas.split(",").map(item => item.trim()),
      },
    };

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setError(null);

    const payload = {
      coverLetter,
      name: formData.name || "Applicant",
    };

    try {
      const response = await fetch("/api/cover-letter/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("Content-Type");

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          const data = await response.json().catch(() => ({}));
          const message =
            typeof data?.error === "string" && data.error.length > 0
              ? data.error
              : "Failed to generate PDF. Please try again.";
          setError(message);
        } else {
          setError("Server error occurred while downloading the PDF.");
        }
        return;
      }

      if (!contentType?.includes("application/pdf")) {
        setError("Unexpected server response. Expected PDF content.");
        return;
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        setError("Downloaded file was empty. Please try again.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Cover_Letter_${formData.name || "Applicant"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (networkErr) {
      console.error("❌ Network or unexpected error:", networkErr);
      setError("Network error. Please check your connection and try again.");
    }
  };

  const handleDownloadDocx = async () => {
    setError(null);

    const payload = {
      coverLetter,
      name: formData.name || "Applicant",
    };

    try {
      const response = await fetch("/api/cover-letter/download-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Failed to download .docx file.");
        return;
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        setError("Downloaded .docx file was empty.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Cover_Letter_${formData.name || "Applicant"}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ .docx Download Error:", err);
      setError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <HeaderBar title="Generate Cover Letter" />

      {loading && (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50"></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow mt-4">
        <h2 className="text-2xl font-bold mb-4">Generate Cover Letter</h2>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4">
          <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Job Title" />
          <input name="companyName" value={formData.companyName} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Company Name" />
          <input name="name" value={formData.name} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Your Name" />
          <input name="email" value={formData.email} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Your Email" />
          <input name="phone" value={formData.phone} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Phone Number" />
          <textarea name="summary" value={formData.summary} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Paste your resume summary here..." />
          <input name="focusAreas" value={formData.focusAreas} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Focus Areas (comma separated)" />

          {/* ✅ Length Selector */}
          <select
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="Concise">Short (Concise)</option>
            <option value="Standard">Standard Length</option>
            <option value="Detailed">Long (Detailed)</option>
          </select>
        </div>

        {/* Generate Button */}
        <div className="mt-6 text-center">
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Output + Download */}
        {coverLetter && (
          <>
            <div className="mt-8 whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-sm">
              {coverLetter}
            </div>

            <div className="mt-4 text-center space-x-4">
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download PDF
              </button>

              <button
                onClick={handleDownloadDocx}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Download .docx
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateCoverLetter;
