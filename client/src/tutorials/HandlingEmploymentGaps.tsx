import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const HandlingEmploymentGaps: React.FC = () => {
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
          How to Handle Employment Gaps on Your Resume
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Normalize the Gap</li>
            <li className="after:content-['→'] after:mx-2">Explain with Confidence</li>
            <li className="after:content-['→'] after:mx-2">Show Growth</li>
            <li className="after:content-['→'] after:mx-2">Formatting Approaches</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Support</li>
          </ol>
        </div>

        {/* Section 1: Normalize */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Normalize the Career Gap</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Life happens. Gaps in employment are more common than ever. From caregiving and layoffs to travel or education, it's okay to take a break from the workforce. Don't hide it—own it.
          </p>
        </section>

        {/* Section 2: Confidence */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Explain the Gap Confidently</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Use a short phrase like “Family Care (2021–2023)” or “Professional Development”</li>
            <li>Do not overshare. Keep the explanation simple and neutral.</li>
            <li>Include the gap on your resume if it spans more than 3–4 months</li>
          </ul>
        </section>

        {/* Section 3: Show Growth */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Highlight Growth During the Gap
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("growthInfo")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Use the gap to show initiative. Mention courses, certifications, volunteer work, or freelance projects completed during that time.
          </p>
          <Modal
            id="growthInfo"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Even if unpaid, activities that build skills or demonstrate leadership (like leading a PTA or community project) show you're proactive.</p>}
          />
        </section>

        {/* Section 4: Formatting */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Formatting Techniques</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Use a “Career Break” entry with date range to avoid timeline confusion</li>
            <li>Group short-term freelance projects into one entry to avoid gaps</li>
            <li>Don’t manipulate dates dishonestly—recruiters will notice</li>
          </ul>
        </section>

        {/* Section 5: CVitaePRO Support */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps You Handle Gaps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Detects and flags unexplained gaps for review</li>
            <li>✓ Offers wording templates based on gap reasons</li>
            <li>✓ Suggests resume sections to offset timeline gaps (skills, projects)</li>
            <li>✓ Maintains consistent formatting while explaining career breaks</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HandlingEmploymentGaps;
