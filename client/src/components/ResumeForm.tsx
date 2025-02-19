import React, { useState } from "react";
import ResumeUpload from "./ResumeUpload";

const ResumeForm: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>("");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Resume Editor</h2>
      <ResumeUpload onParse={(text) => setResumeText(text)} />
      <textarea
        className="w-full h-64 p-3 mt-4 border rounded-md"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
    </div>
  );
};

export default ResumeForm;
