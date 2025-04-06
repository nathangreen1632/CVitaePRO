import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/core/modals/Modal.tsx";

const CareerChangeTutorial: React.FC = () => {
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
          How to Explain Career Changes on a Resume
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Career Change Types</li>
            <li className="after:content-['→'] after:mx-2">Framing Your Story</li>
            <li className="after:content-['→'] after:mx-2">Highlighting Transferable Skills</li>
            <li className="after:content-['→'] after:mx-2">Using the Summary Section</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Optimization</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Types of Career Transitions</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Career changes may be industry shifts, role changes, or complete pivots. Whether you're moving from education to tech, or finance to marketing,
            it's all about demonstrating readiness for the new field.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            How to Frame a Career Shift Positively
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("frame-shift")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Always focus on what you’ve gained, not what you’re leaving. Frame the shift as intentional, growth-oriented, and skill-driven.
          </p>
          <Modal
            id="frame-shift"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use language like "building on prior experience," "applying core strengths," or "leveraging cross-functional knowledge."</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Highlight Transferable Skills</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Communication, leadership, or project management</li>
            <li>Industry tools that overlap (e.g. CRM, Excel, analytics)</li>
            <li>Problem-solving, collaboration, and adaptability</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Use the Summary to Tell Your Story</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Your resume summary is the best place to acknowledge your transition directly. Mention your prior field, current goal, and why you're a strong fit.
            For example: <em>"Former educator transitioning to user experience design, bringing a background in communication, empathy, and problem-solving."</em>
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Can Help</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Suggests custom summary language for career changers</li>
            <li>✓ Boosts transferable skills in your achievements</li>
            <li>✓ Helps align your story with job descriptions</li>
            <li>✓ Recommends soft skills and industry terms for new roles</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CareerChangeTutorial;
