import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const FinalResumeChecklist: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const formatTextWithRedPRO = (text: string) => {
    const parts = text.split("CVitaePRO");
    return (
      <>
        {parts[0]}
        CVitae<span className="text-red-500">PRO</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Final Resume Checklist Before You Submit
        </h1>

        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Grammar</li>
            <li className="after:content-['→'] after:mx-2">Length</li>
            <li className="after:content-['→'] after:mx-2">ATS Readiness</li>
            <li className="after:content-['→'] after:mx-2">Consistency</li>
            <li>Proofreading</li>
          </ol>
        </div>

        {/* Section: Grammar */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">✅ Grammar & Spelling</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Run a grammar checker or read aloud. Misspellings and typos instantly reduce credibility.
          </p>
        </section>

        {/* Section: Length */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">✅ Resume Length</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            1 page for entry-level. 2 pages max for professionals. Cut older or irrelevant jobs if needed.
          </p>
        </section>

        {/* Section: ATS */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            ✅ ATS Compatibility
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("ats")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Make sure your resume avoids columns, images, and uncommon fonts. Use standard sections and clear formatting.
          </p>
          <Modal
            id="ats"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use the ATS Score tool in {formatTextWithRedPRO("CVitaePRO")} to see how well your resume will perform with automated screening systems.</p>}
          />
        </section>

        {/* Section: Consistency */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">✅ Consistency in Style</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Same font size and color across all sections</li>
            <li>Dates aligned and formatted the same way</li>
            <li>Same bullet point characters throughout</li>
          </ul>
        </section>

        {/* Section: Proofreading */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">✅ Final Proofreading Steps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Print it out and read it line by line</li>
            <li>Have a friend or mentor review it</li>
            <li>Double check contact info and job titles</li>
            <li>Remove any placeholder text or notes</li>
          </ul>
        </section>

        {/* Section: Final Tip */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Makes It Easy</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Built-in grammar suggestions</li>
            <li>✓ Auto-formatting and section standardization</li>
            <li>✓ ATS scoring and enhancement</li>
            <li>✓ Smart download options with PDF and DOCX</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FinalResumeChecklist;
