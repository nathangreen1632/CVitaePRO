import React from "react";

const Features = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 px-6 py-12">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Discover What Makes CVitae<span className="text-red-500">PRO</span> Stand Out
        </h1>
        <p className="text-lg text-neutral-700 dark:text-gray-300 max-w-3xl mx-auto">
          CVitae<span className="text-red-500">PRO</span> empowers job seekers to build powerful, optimized, and professional resumes—driven by cutting-edge AI and a laser focus on Applicant Tracking System (ATS) success.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {/* Resume Creation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">AI-Powered Resume Builder</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Create a clean, ATS-friendly resume in minutes. Our guided wizard walks you through each step of the process, while advanced AI suggests improvements in real-time. No design skills or formatting knowledge required.
          </p>
        </div>

        {/* Resume Enhancement */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">Resume Enhancement</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Upload your existing resume as a PDF or DOCX and let our system optimize it for recruiter appeal. The AI revises your bullet points, strengthens your phrasing, and maximizes keyword density—all while preserving your voice.
          </p>
        </div>

        {/* ATS Score */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">ATS Compatibility Scoring</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Get a comprehensive breakdown of your resume’s ATS readiness. Our scoring engine evaluates formatting, keyword relevance, contact structure, and industry terms to calculate your chances of passing automated filters.
          </p>
        </div>

        {/* Secure Storage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">Encrypted Resume Storage</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Every resume is encrypted at rest and in transit using modern security protocols. You can safely edit, revisit, and re-download any resume from your personal dashboard at any time.
          </p>
        </div>

        {/* Auto-Save */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">Auto-Save + Local Progress</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Never lose your work again. CVitae<span className="text-red-500">PRO</span> auto-saves your resume data to local storage and syncs with your account when you’re logged in—ensuring seamless progress continuity.
          </p>
        </div>

        {/* Resume Templates */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">ATS-Approved Templates</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Choose from a curated set of professional templates that meet the latest ATS design standards—no tables, no fancy graphics, just clean layouts optimized for readability and parsing.
          </p>
        </div>

        {/* Cover Letter Generation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">AI-Generated Cover Letters</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Don’t stop at your resume. Our system will craft a personalized, compelling cover letter tailored to each role—pulling context from your resume and job goals to highlight your fit and enthusiasm.
          </p>
        </div>

        {/* Resume Editor */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">In-Browser Resume Editor</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            Edit your resume directly inside the platform. Add, remove, or rearrange sections, tweak your language, and preview the final product in PDF or DOCX format—all without leaving the app.
          </p>
        </div>

        {/* Legal & Activity Logs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500">Audit Logs & Legal Controls</h2>
          <p className="text-neutral-700 dark:text-neutral-200 text-sm">
            CVitae<span className="text-red-500">PRO</span> provides transparency. All user activity is logged for accountability, and our admin interface offers a full legal view of usage terms, policy acceptance, and system performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
