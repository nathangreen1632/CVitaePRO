import React from "react";

const Features = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Features of CVitaePRO</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">
        Unlock powerful tools to create the perfect resume. Enhance your application with AI-driven feedback, ATS optimization, and live editing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">Create Your Resume</h2>
          <p className="text-gray-400">Generate a professional resume with AI-powered assistance.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">Live Feedback</h2>
          <p className="text-gray-400">Get instant suggestions to improve your resume content.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">Auto-Save</h2>
          <p className="text-gray-400">Your resume progress is automatically saved as you edit.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">ATS Score</h2>
          <p className="text-gray-400">Analyze your resume’s compatibility with Applicant Tracking Systems.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">Customization</h2>
          <p className="text-gray-400">Choose from multiple professional resume templates.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">Secure Resume Storage</h2>
          <p className="text-gray-400">Your resumes are encrypted and stored safely.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
