import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const GapExplanationTutorial: React.FC = () => {
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
          How to Explain Employment Gaps on Your Resume
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Normalize Gaps</li>
            <li className="after:content-['→'] after:mx-2">Types of Acceptable Gaps</li>
            <li className="after:content-['→'] after:mx-2">How to Frame Gaps</li>
            <li className="after:content-['→'] after:mx-2">Bullet Point Techniques</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Support</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Gaps Are Normal in 2024</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Recruiters understand that gaps happen—especially post-COVID, during career pivots, or due to family responsibilities. It’s better to address gaps than ignore them.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Common (and Valid) Reasons for Gaps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Medical or mental health recovery</li>
            <li>Parenting or caregiving responsibilities</li>
            <li>Pursuing education or certifications</li>
            <li>Freelance or gig work not formally listed</li>
            <li>Travel, relocation, or immigration delays</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            How to Frame Gaps Constructively
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("gap-frame")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Briefly acknowledge the gap in your resume or cover letter. Keep the tone confident and proactive—emphasize what you learned or how you stayed engaged.
          </p>
          <Modal
            id="gap-frame"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use phrasing like: "Took time to complete online certifications in data analytics" or "Acted as primary caregiver while staying current with industry trends."</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Use Bullet Points to Show Value</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            If you did freelance, education, or volunteer work during a gap, treat it like a real position. Add bullets that show:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Skills used or gained</li>
            <li>Projects completed</li>
            <li>Initiatives led or supported</li>
            <li>Relevant tools, software, or certifications obtained</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Provides gap explanation templates for your summary section</li>
            <li>✓ Reframes volunteer or freelance work to look professional</li>
            <li>✓ Suggests ways to highlight skills gained during time away</li>
            <li>✓ Optimizes the flow of your resume to reduce red flags</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GapExplanationTutorial;
