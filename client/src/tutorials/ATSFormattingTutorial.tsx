import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const ATSFormattingTutorial: React.FC = () => {
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
          Formatting Your Resume for ATS Systems
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Why Formatting Matters</li>
            <li className="after:content-['→'] after:mx-2">Avoiding Common Pitfalls</li>
            <li className="after:content-['→'] after:mx-2">Best Practices</li>
            <li>{formatTextWithRedPRO("CVitaePRO Templates")}</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Formatting Matters
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("importance")}
            />
          </h2>
          <p>
            ATS (Applicant Tracking Systems) rely on consistent formatting to parse your resume correctly. If your layout is too complex,
            the system may misread or skip your content entirely.
          </p>
          <Modal
            id="importance"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Complex tables, columns, icons, and fancy formatting often confuse ATS software and can cost you the interview.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Common Formatting Mistakes</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Using tables or multi-column layouts</li>
            <li>Embedding important info inside headers or footers</li>
            <li>Adding icons, graphics, or emojis</li>
            <li>Using unusual fonts or inconsistent spacing</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            ATS-Friendly Formatting Tips
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("tips")}
            />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Use a single-column format</li>
            <li>Stick to standard section headers (e.g., "Work Experience")</li>
            <li>Use bullet points for achievements</li>
            <li>Align all text to the left and avoid centering content</li>
            <li>Choose readable fonts like Arial, Calibri, or Times New Roman</li>
          </ul>
          <Modal
            id="tips"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Simple formatting ensures your resume is readable by both machines and humans. Keep it clean, focused, and consistent.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">
            How {formatTextWithRedPRO("CVitaePRO")} Helps
          </h2>
          <p>
            All our resume templates are designed to meet ATS formatting standards. Our enhancement process also ensures your content
            is aligned correctly and uses industry-friendly layouts without breaking compatibility.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ATSFormattingTutorial;
