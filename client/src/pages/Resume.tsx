import React from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import GenerateResumeForm from "../components/GenerateResumeForm.jsx";


const Resume: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Wrap the header in a semantic landmark */}
      <header>
        <HeaderBar title="Generate Resume" />
        {/* Add screen reader-only heading inside header landmark */}
        <h1 className="sr-only" aria-label="Generate Resume">
          Generate Resume
        </h1>
      </header>

      <main className="container mx-auto p-6">
        <GenerateResumeForm />
      </main>
    </div>
  );
};

export default Resume;
