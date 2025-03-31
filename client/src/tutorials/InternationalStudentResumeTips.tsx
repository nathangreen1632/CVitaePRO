import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const InternationalStudentResumeTips: React.FC = () => {
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
          Resume Tips for International Students
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Cultural Expectations</li>
            <li className="after:content-['→'] after:mx-2">Language Clarity</li>
            <li className="after:content-['→'] after:mx-2">Education Framing</li>
            <li className="after:content-['→'] after:mx-2">Work Authorization</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Help</li>
          </ol>
        </div>

        {/* Section 1: Cultural Expectations */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Understand U.S. Resume Culture</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            In the U.S., resumes should be concise (1–2 pages), avoid personal details (like photos, marital status, or date of birth), and focus on skills and accomplishments.
          </p>
        </section>

        {/* Section 2: Language Clarity */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Keep Language Clear and Professional
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("languageTips")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Avoid complex phrases or idioms. Use action verbs and keep your grammar crisp. Ask a native speaker or use editing tools to proofread.
          </p>
          <Modal
            id="languageTips"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Instead of “I had the opportunity to assist,” say “Assisted with...” — simple, direct language reads best.</p>}
          />
        </section>

        {/* Section 3: Education Formatting */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to List Your Education</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Translate degrees into U.S.-equivalent terms when possible (e.g., “equivalent to U.S. Bachelor’s degree”)</li>
            <li>Include GPA if strong, but clarify scale (e.g., “GPA: 3.8 / 4.0”)</li>
            <li>Avoid listing high school once you’re in college or above</li>
          </ul>
        </section>

        {/* Section 4: Work Authorization */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Clarify Your Work Authorization
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("authorization")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Let employers know about your visa or work status (e.g., "Authorized to work in the U.S. on OPT until May 2026"). This builds trust and avoids confusion.
          </p>
          <Modal
            id="authorization"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>If you need sponsorship, do not hide it—but instead show your value clearly and early in the resume to encourage continued interest.</p>}
          />
        </section>

        {/* Section 5: CVitaePRO Tips */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Supports International Students</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Automatically adjusts language for clarity and tone</li>
            <li>✓ Suggests best placement for education or visa info</li>
            <li>✓ Provides formatting that avoids U.S. resume red flags</li>
            <li>✓ Helps translate international experience to employer-friendly terms</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default InternationalStudentResumeTips;
