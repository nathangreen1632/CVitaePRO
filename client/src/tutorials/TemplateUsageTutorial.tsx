import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const TemplateUsageTutorial: React.FC = () => {
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
          How to Use Resume Templates Effectively
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">What Are Templates?</li>
            <li className="after:content-['→'] after:mx-2">Choosing the Right Layout</li>
            <li className="after:content-['→'] after:mx-2">Do's and Don'ts</li>
            <li className="after:content-['→'] after:mx-2">Common Pitfalls</li>
            <li>Why {formatTextWithRedPRO("CVitaePRO")} Templates Work</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What Is a Resume Template?
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("what-template")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            A resume template is a pre-formatted layout that structures your information in a clean and readable format. It helps you focus on content while ensuring consistency and professionalism.
          </p>
          <Modal
            id="what-template"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Templates are especially useful for people who aren't designers. They eliminate guesswork while keeping your resume aligned with recruiter expectations.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to Choose the Right Template</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Choose a clean, single-column layout with clear section headers</li>
            <li>Avoid decorative fonts, borders, or colored sidebars</li>
            <li>Pick a template that aligns with your industry (traditional vs modern)</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Template Do's and Don'ts
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("dos-donts")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✅ DO: Use consistent fonts and spacing</li>
            <li>✅ DO: Use bullet points for experience</li>
            <li>❌ DON'T: Use tables or columns</li>
            <li>❌ DON'T: Add headshots or icons</li>
          </ul>
          <Modal
            id="dos-donts"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Most ATS systems can't read icons or columns. Simplicity and structure always win over style-heavy formatting.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Common Pitfalls When Using Templates</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Overwriting placeholder text without adjusting the layout</li>
            <li>Leaving generic section names like “Insert Here”</li>
            <li>Copy-pasting content from old resumes without updates</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Why {formatTextWithRedPRO("CVitaePRO")} Templates Work</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Our templates are:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>✓ ATS-friendly and fully parseable</li>
            <li>✓ Designed with recruiters in mind</li>
            <li>✓ Visually clean while emphasizing your skills and results</li>
            <li>✓ Aligned with current resume trends and hiring needs</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TemplateUsageTutorial;
