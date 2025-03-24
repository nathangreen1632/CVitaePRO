import React, { useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";

const GenerateCoverLetter: React.FC = () => {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

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
    setDownloadLoading(true);
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
      setError("Network error. Please check your connection and try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadLoading(true);
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
      setError("Network error. Please check your connection and try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header>
        <HeaderBar title="Generate Cover Letter" />
        <h1 className="sr-only" aria-label="Generate Cover Letter">
          Generate Cover Letter
        </h1>
      </header>

      <main className="container mx-auto p-6">
        {downloadLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="animate-spin h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <p className="text-white font-medium text-lg">Downloading file...</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50"></div>
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow mt-4">
          <h2 className="text-2xl font-bold mb-4">Generate Cover Letter</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="jobTitle">Job Title</label>
              <input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Developer, Salesman, etc..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="companyName">Company Name</label>
              <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Acme, Inc..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Your Name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="John Doe..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Your Email</label>
              <input id="email" name="email" value={formData.email} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="email@email.com..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="555-555-5555..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="summary">Paste Your Resume Summary</label>
              <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="Paste your resume summary here..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="focusAreas">Focus Areas</label>
              <input id="focusAreas" name="focusAreas" value={formData.focusAreas} onChange={handleChange} className="p-2 w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" placeholder="e.g., leadership, project management" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="length">Length Preference</label>
              <select
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="appearance-none p-2 pr-[40px] w-full rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M5.516 7.548a.625.625 0 0 1 .884 0L10 11.147l3.6-3.6a.625.625 0 1 1 .884.884l-4.042 4.041a.625.625 0 0 1-.884 0L5.516 8.432a.625.625 0 0 1 0-.884z'/></svg>")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="Concise">Short (Concise)</option>
                <option value="Standard">Standard Length</option>
                <option value="Detailed">Long (Detailed)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button onClick={handleSubmit} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
              {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {coverLetter && (
            <>
              <div className="mt-8 whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-sm">
                {coverLetter}
              </div>

              <div className="mt-4 text-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-gray-800 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Download PDF
                </button>

                <button
                  onClick={handleDownloadDocx}
                  className="bg-gray-800 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                >
                  Download .docx
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GenerateCoverLetter;
