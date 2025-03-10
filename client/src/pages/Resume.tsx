import React from "react";
import HeaderBar from "../components/HeaderBar.tsx"; // ✅ NEW

const Resume = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-12">
      {/* ✅ HeaderBar under navbar */}
      <HeaderBar title="Resume Builder" />

      {/* ✅ Main content */}
      <main className="w-full flex flex-col items-center">
        {/* ✅ Page Title */}
        <h1 className="text-4xl font-bold mb-6 text-center mt-4">Create Your Resume</h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Build a professional, ATS-compliant resume in minutes.
        </p>

        {/* ✅ Resume Creation Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <button className="bg-blue-500 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition">
            Create Resume
          </button>
          <button className="bg-red-500 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-red-600 transition">
            Auto-Save Enabled
          </button>
        </div>

        {/* ✅ Resume Editing Form */}
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Resume Details</h2>

          <label className="block mb-3">
            <span className="text-gray-300">Full Name</span>
            <input type="text" className="w-full p-3 bg-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Professional Summary</span>
            <textarea className="w-full p-3 bg-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write a brief summary..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Work Experience</span>
            <textarea className="w-full p-3 bg-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="List your work experience..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Education</span>
            <textarea className="w-full p-3 bg-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="List your educational background..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Skills</span>
            <input type="text" className="w-full p-3 bg-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E.g. JavaScript, React, Node.js" />
          </label>

          {/* ✅ Save & Download Buttons */}
          <div className="flex justify-between mt-6">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
              Save Resume
            </button>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition">
              Download PDF
            </button>
          </div>
        </div>

        {/* ✅ ATS Score Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold">ATS Score</h2>
          <p className="text-lg text-gray-400">Optimize your resume for better job matching</p>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
            <span className="text-4xl font-bold text-green-400">80%</span>
            <p className="text-gray-300 mt-2">Your resume is ATS-friendly!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resume;
