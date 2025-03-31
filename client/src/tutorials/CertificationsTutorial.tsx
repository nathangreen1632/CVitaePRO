import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const CertificationsTutorial: React.FC = () => {
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
          Listing Certifications & Training on Your Resume
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Relevance</li>
            <li className="after:content-['→'] after:mx-2">Formatting</li>
            <li className="after:content-['→'] after:mx-2">Placement</li>
            <li className="after:content-['→'] after:mx-2">Expired or In Progress</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Enhancements</li>
          </ol>
        </div>

        {/* Section 1: Relevance */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Choose Relevant Certifications</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Only list certifications that are relevant to the job you're applying for. Avoid cluttering your resume with courses that don’t demonstrate professional growth.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>✅ Certified Scrum Master (CSM)</li>
            <li>✅ Google Analytics Certified</li>
            <li>❌ Dog Obedience Training (unless applying to pet care jobs)</li>
          </ul>
        </section>

        {/* Section 2: Formatting */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to Format Them</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Include the certification title, issuing organization, and date received. If it's in progress, specify that.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li><strong>Example:</strong> AWS Certified Solutions Architect – Associate | Amazon Web Services | 2024</li>
            <li><strong>In Progress:</strong> Microsoft Certified: Azure Fundamentals (Expected: June 2024)</li>
          </ul>
        </section>

        {/* Section 3: Placement */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Where to Put Them</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Add a separate section titled “Certifications” or “Licenses & Training.” Place it near the bottom unless it's crucial for the role (like in healthcare or finance).
          </p>
        </section>

        {/* Section 4: Expired or In Progress */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What About Expired or Ongoing Certifications?
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("statusInfo")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Expired certifications should be removed unless they carry major relevance. If you're currently working on one, make that clear.
          </p>
          <Modal
            id="statusInfo"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Recruiters appreciate honesty—showing you're pursuing relevant education still counts, even if not yet complete.</p>}
          />
        </section>

        {/* Section 5: CVitaePRO Enhancements */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Improves This Section</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Flags outdated or irrelevant certifications</li>
            <li>✓ Suggests formatting based on industry norms</li>
            <li>✓ Adds missing issue dates or clarifies "In Progress" status</li>
            <li>✓ Prioritizes certifications that impact ATS scoring</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CertificationsTutorial;
