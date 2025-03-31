import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const EmploymentGapsTutorial: React.FC = () => {
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
          How to Handle Employment Gaps Gracefully
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">What Counts as a Gap?</li>
            <li className="after:content-['→'] after:mx-2">Why Gaps Raise Flags</li>
            <li className="after:content-['→'] after:mx-2">Filling the Time</li>
            <li className="after:content-['→'] after:mx-2">Resume Language</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Suggestions</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What Is Considered a Gap?
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("what-gap")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Any period of 3+ months without full-time work is usually considered an employment gap.
          </p>
          <Modal
            id="what-gap"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Short breaks for travel, education, or family aren’t necessarily red flags—it's how you present them that matters.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Why Gaps Raise Questions</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Hiring managers want to know if you’ve been inactive or out of practice. Gaps can signal potential disengagement—unless you frame them well.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What You Can Do During a Gap
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("fill-gap")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Freelancing, consulting, or contract work</li>
            <li>Volunteer work or caregiving</li>
            <li>Online courses, certifications, or bootcamps</li>
          </ul>
          <Modal
            id="fill-gap"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Even informal work or unpaid projects can show initiative, commitment, and skill development.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to Explain Gaps on Your Resume</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Use a functional or hybrid resume format</li>
            <li>Group short-term contracts under one umbrella role</li>
            <li>Include a brief “Professional Development” or “Career Pause” entry with dates</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Can Help</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Our AI suggests language to positively frame your gap</li>
            <li>✓ Resume wizard lets you add professional development sections</li>
            <li>✓ We highlight transferable skills even from non-traditional roles</li>
            <li>✓ Visual formatting smooths over timeline inconsistencies</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default EmploymentGapsTutorial;
