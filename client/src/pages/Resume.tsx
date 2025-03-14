import React from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import GenerateResumeForm from "../components/GenerateResumeForm.jsx";

const Resume: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeaderBar title="Generate Resume" />
      <main className="container mx-auto p-6">
        <GenerateResumeForm />
      </main>
    </div>
  );
};

export default Resume;
