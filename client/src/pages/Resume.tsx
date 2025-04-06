import React from "react";
import HeaderBar from "../components/layout/HeaderBar.tsx";
import GenerateResumeForm from "../components/resume/generation/GenerateResumeForm.tsx";


const Resume: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header>
        <HeaderBar title="Resume Form" />
        <h1 className="sr-only" aria-label="Resume Form">
          Resume Form
        </h1>
      </header>

      <main className="container mx-auto p-6">
        <GenerateResumeForm />
      </main>
    </div>
  );
};

export default Resume;
