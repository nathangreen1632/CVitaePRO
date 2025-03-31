import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const ResumeForCareerChange: React.FC = () => {
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
          How to Write a Resume for a Career Change
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Transferable Skills</li>
            <li className="after:content-['→'] after:mx-2">Functional Format</li>
            <li className="after:content-['→'] after:mx-2">New Industry Language</li>
            <li className="after:content-['→'] after:mx-2">Strategic Summary</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Tools</li>
          </ol>
        </div>

        {/* Section 1: Transferable Skills */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Identify Your Transferable Skills</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Skills like leadership, communication, project management, or data analysis can carry over into many industries. Your resume should highlight these and connect them to the new role.
          </p>
        </section>

        {/* Section 2: Functional Format */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Use a Functional or Hybrid Format
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("formatInfo")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Traditional chronological resumes may highlight unrelated experience. Instead, use a format that organizes content by skill sets or categories before listing job titles.
          </p>
          <Modal
            id="formatInfo"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Start your resume with a section called “Relevant Skills” or “Industry Experience” to focus attention on transferable value.</p>}
          />
        </section>

        {/* Section 3: Industry Language */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Adopt the Language of the New Industry</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Review job descriptions and mimic their terminology. Reword your past experience in a way that aligns with the job you're targeting.
          </p>
        </section>

        {/* Section 4: Resume Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Write a Strategic Career Summary
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("summaryTips")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Address the career change directly in your summary. Example: “Project Coordinator transitioning into UX Design with certification in Figma, user research, and wireframing.”
          </p>
          <Modal
            id="summaryTips"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Position yourself for the new role in the first 3 lines of your resume. That’s where recruiters spend their first 6 seconds.</p>}
          />
        </section>

        {/* Section 5: CVitaePRO Support */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Supports Career Changers</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Highlights transferable skills with AI prompts</li>
            <li>✓ Helps restructure content into functional or hybrid format</li>
            <li>✓ Rewrites bullets with new industry keywords</li>
            <li>✓ Adds certification or education badges for quick attention</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResumeForCareerChange;
